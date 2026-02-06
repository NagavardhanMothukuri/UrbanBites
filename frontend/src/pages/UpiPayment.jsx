import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoCopyOutline, IoCheckmarkCircle, IoTimeOutline, IoArrowBack } from 'react-icons/io5';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '../context/ThemeContext';



function UpiPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, upiId, transactionId } = location.state || {};
  const { currentMode, theme } = useTheme();
  
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderId, setOrderId] = useState(null);
  
  // Get amount safely from order data
  const amount = order?.totalAmount || order?.total || order?.amount || 0;


  
  const timerRef = useRef(null);
  const statusCheckRef = useRef(null);

  useEffect(() => {
    if (!order) {
      navigate('/checkout');
      return;
    }

    // Store order ID for status checks
    const oid = order._id || order.orderId || order.id;
    setOrderId(oid);

    // Calculate initial time left
    const expiryTime = order.upiPaymentExpiry ? new Date(order.upiPaymentExpiry).getTime() : Date.now() + 600000;
    const now = new Date().getTime();
    const initialTimeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));
    setTimeLeft(initialTimeLeft);

    if (initialTimeLeft === 0) {
      setIsExpired(true);
    }


    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check payment status every 5 seconds
    statusCheckRef.current = setInterval(() => {
      checkPaymentStatus();
    }, 5000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(statusCheckRef.current);
    };
  }, [order, navigate]);

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      // Use withCredentials for cookie-based auth (consistent with CheckOut.jsx)
      const response = await axios.get(
        `${serverUrl}/api/order/upi-status/${orderId}`,
        { withCredentials: true }
      );

      if (response.data.payment) {
        setPaymentStatus('completed');
        clearInterval(timerRef.current);
        clearInterval(statusCheckRef.current);
        // Fetch the order data and add to state
        try {
          const orderResponse = await axios.get(
            `${serverUrl}/api/order/${orderId}`,
            { withCredentials: true }
          );
          dispatch(addMyOrder(orderResponse.data));
        } catch (orderError) {
          console.error('Error fetching order:', orderError);
        }
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } else if (response.data.isExpired) {
        setIsExpired(true);
        clearInterval(timerRef.current);
      }
    } catch (error) {
      console.error('Status check error:', error);
      // Don't show error to user for background status checks
    }
  };


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUtrSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate UTR (12 digits)
    if (!/^\d{12}$/.test(utr)) {
      setError('Please enter a valid 12-digit UTR number');
      setLoading(false);
      return;
    }

    try {
      const oid = order._id || order.orderId || order.id;
      // Use withCredentials for cookie-based auth (consistent with CheckOut.jsx)
      const response = await axios.post(
        `${serverUrl}/api/order/verify-utr`,
        { orderId: oid, utr },
        { withCredentials: true }
      );

      setSuccess('Payment verified successfully! Your order has been placed.');
      setPaymentStatus('completed');
      clearInterval(timerRef.current);
      clearInterval(statusCheckRef.current);
      
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify UTR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <div className={`min-h-screen py-8 px-4 transition-all duration-500 ${currentMode.bg}`}>
      <div className={`max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${currentMode.card}`}>
        {/* Header */}
        <div className={`p-6 text-white bg-gradient-to-r ${theme.gradient}`}>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <IoArrowBack className="text-xl" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold mb-2">UPI Payment</h1>
          <p className="text-white/90">Complete your payment to place order</p>
        </div>


        <div className="p-6 space-y-6">
          {/* Timer */}
          <div className={`flex items-center justify-center gap-2 p-4 rounded-xl ${isExpired ? 'bg-red-50 text-red-600' : `${currentMode.active} ${currentMode.icon}`}`}>
            <IoTimeOutline className="text-2xl" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isExpired ? 'Payment Time Expired' : 'Complete Payment Within'}
              </p>
              {!isExpired && (
                <p className="text-3xl font-bold font-mono">{formatTime(timeLeft)}</p>
              )}
            </div>
          </div>


          {/* QR Code */}
          <div className="text-center space-y-4">
            <div className={`p-4 rounded-xl border-2 inline-block ${currentMode.card} ${currentMode.border}`}>
              {upiId && (
                <QRCodeSVG 
                  value={`upi://pay?pa=${upiId}&pn=${encodeURIComponent(order?.shop?.name || 'UrbanBites')}&am=${amount}&cu=INR&tn=${transactionId || 'ORDER'}`}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              )}

            </div>
            <p className={`text-sm ${currentMode.textMuted}`}>Scan with any UPI app</p>
          </div>



          {/* UPI ID */}
          <div className={`p-4 rounded-xl ${currentMode.cardAlt}`}>
            <p className={`text-sm mb-2 ${currentMode.textMuted}`}>Or pay to this UPI ID:</p>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${currentMode.card} ${currentMode.border}`}>
              <span className={`font-mono font-medium ${currentMode.text}`}>{upiId}</span>
              <button 
                onClick={copyUpiId}
                className={`flex items-center gap-1 transition-colors ${currentMode.icon}`}
              >
                {copied ? (
                  <>
                    <IoCheckmarkCircle className="text-lg" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <IoCopyOutline className="text-lg" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>


          {/* Amount */}
          <div className={`flex justify-between items-center p-4 rounded-xl ${currentMode.cardAlt}`}>
            <span className={currentMode.textMuted}>Amount to Pay:</span>
            <span className={`text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>₹{amount}</span>
          </div>



          {/* Instructions */}
          <div className={`p-4 rounded-xl text-sm space-y-2 ${currentMode.info}`}>
            <p className="font-medium">How to pay:</p>
            <ol className={`list-decimal list-inside space-y-1 ${currentMode.text}`}>
              <li>Scan the QR code or copy the UPI ID</li>
              <li>Pay using any UPI app (GPay, PhonePe, Paytm)</li>
              <li>Enter the 12-digit UTR number below</li>
              <li>Click Verify to complete your order</li>
            </ol>
          </div>


          {/* UTR Input */}
          {!isExpired && paymentStatus !== 'completed' && (
            <form onSubmit={handleUtrSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${currentMode.text}`}>
                  Enter UTR Number (12 digits)
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="Enter 12-digit UTR"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${currentMode.input}`}
                  disabled={loading}
                />
                <p className={`text-xs mt-1 ${currentMode.textMuted}`}>
                  UTR is the 12-digit number in your payment receipt
                </p>
              </div>

              {error && (
                <div className={`p-3 rounded-lg text-sm ${currentMode.error}`}>
                  {error}
                </div>
              )}

              {success && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${currentMode.success}`}>
                  <IoCheckmarkCircle className="text-lg" />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || utr.length !== 12}
                className={`w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${theme.gradient}`}
              >
                {loading ? 'Verifying...' : 'Verify Payment'}
              </button>
            </form>
          )}


          {/* Expired Message */}
          {isExpired && (
            <div className={`text-center p-4 rounded-xl ${currentMode.error}`}>
              <p className="font-medium mb-2">Payment time has expired</p>
              <button
                onClick={() => navigate('/checkout')}
                className={`font-medium ${currentMode.icon}`}
              >
                Place Order Again
              </button>
            </div>
          )}

          {/* Success Message */}
          {paymentStatus === 'completed' && (
            <div className={`text-center p-4 rounded-xl ${currentMode.success}`}>
              <IoCheckmarkCircle className="text-5xl mx-auto mb-2" />
              <p className="font-medium">Payment Verified!</p>
              <p className="text-sm">Redirecting to order confirmation...</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UpiPayment;
