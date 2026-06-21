import { createContext, use } from "react";

const Context = createContext({ success: "false" });

export const useContext = () => use(Context);

export const ContextProvider = ({ children, value }: { children: React.ReactNode, value: string }) => <Context value={{ success: value }}>{children}</Context>