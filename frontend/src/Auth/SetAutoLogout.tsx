import { jwtDecode } from "jwt-decode";

export const setAutoLogout = (
    token: string,
    logout: (message?: string) => void
)=>{
    try{
        const decoded = jwtDecode<{exp: number}>(token); 
        const currentTime = Date.now() / 1000;
        
        if(!decoded.exp) return ;

        const timeToExpire = decoded.exp - currentTime;

        if(timeToExpire <= 0){
            logout("Session expired. Please log in again.");
        }else{
            setTimeout(()=>{
                logout("Session expired. Please log in again.");
            }, timeToExpire * 1000)
        }
    } catch (err){
        console.error("Invalid token, logging out...", err);
        logout("Session expired. Please log in again.");
    }
}