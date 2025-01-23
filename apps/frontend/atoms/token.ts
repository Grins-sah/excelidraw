import { atom } from "recoil";

export const tokenAtom = atom({
    key:"tokenKey",
    default:{
        type:false,
        token:""
    }
})