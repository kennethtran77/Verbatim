import { Context, createContext, FunctionComponent, useContext } from "react";
import IApi from "../api";

export interface ServiceContextProps {
    getApi: () => IApi;
    children?: JSX.Element
}

const ServiceContext: Context<ServiceContextProps> = createContext<ServiceContextProps>({} as ServiceContextProps);

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider: FunctionComponent<ServiceContextProps> = ({
    getApi,
    children
}) => {
    return (
        <ServiceContext.Provider value={{ getApi }}>
            {children}
        </ServiceContext.Provider>
    )
}