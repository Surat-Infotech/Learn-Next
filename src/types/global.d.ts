// global.d.ts
declare global {
    interface Window {
        Splitit: any;
        Klarna: any;
        klarnaAsyncCallback: () => void;
        Tawk_API?: any;
        Tawk_LoadStart?: Date;
    }
}

export { }; 
