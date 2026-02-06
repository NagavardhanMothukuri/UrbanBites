import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import mapSlice from "./mapSlice"
export const store=configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'user/setSocket',
                    'user/setUserData',
                    'user/setLocation',
                    'user/setShopsInMyCity',
                    'user/setItemsInMyCity',
                    'user/setMyOrders',
                    'user/setSearchItems',
                    'user/setCurrentCity',
                    'user/setCurrentState',
                    'user/setCurrentAddress',
                    'user/setAddress'
                ],
                ignoredPaths: ['user.socket'],
            },
        }),
})
