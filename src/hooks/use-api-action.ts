import { LocalStorageEnum, NavigationEnum, NextStepEnum, type BaseResponse } from "@/types/api-action";
import type { AxiosResponse } from "axios";
import { useCallback } from "react";
import { createSearchParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { useGlobalAlertBox } from "./use-global-alert-box";

export function useApiAction()
{
    const navigate = useNavigate()
    const { setDialogBox } = useGlobalAlertBox()
    const apiActionAsync = useCallback(async (axiosResponse: AxiosResponse) =>
    {
        const { data }: { data: BaseResponse<any> } = axiosResponse

        if (!data)
        {
            return;
        }

        if (!('isSuccess' in data))
        {
            return;
        }


        data.actions.forEach(async (action) => 
        {
            const { type, step } = action;

            switch (type)
            {
                case NextStepEnum.NOTIFICATION:
                    {
                        const { message, variant } = step
                        toast[variant](message.category, { description: message.description })
                        break;
                    }
                case NextStepEnum.NAVIGATION:
                    {
                        const { variant, baseUrl, path, state } = step
                        const url = `${baseUrl}${path ? `/${path}` : ''}${state ? `?${createSearchParams(state)}` : ''}`
                        // console.log('Navigating to:', url)
                        switch (variant)
                        {
                            case NavigationEnum.INTERNAL:
                                {
                                    navigate(url)
                                    break;
                                }
                            case NavigationEnum.EXTERNAL:
                                {
                                    window.location.href = url
                                    break;
                                }
                            case NavigationEnum.PERMENENT:
                                {
                                    navigate(url, { replace: true })
                                    break;
                                }
                            case NavigationEnum.TEMPORARY:
                                {
                                    navigate(url, { replace: false })
                                    break;
                                }
                        }
                        break;
                    }
                case NextStepEnum.LOCALSTORAGE:
                    {
                        const { variant, propertyName, propertyValue } = step
                        switch (variant)
                        {
                            case LocalStorageEnum.SET:
                                {
                                    localStorage.setItem(propertyName, JSON.stringify(propertyValue))
                                    break;
                                }
                            case LocalStorageEnum.REMOVE:
                                {
                                    localStorage.removeItem(propertyName)
                                    break;
                                }
                        }
                        break;
                    }
                case NextStepEnum.DIALOGBOX: {
                    const { action, message, icon } = step
                    setDialogBox({ action, message, icon })
                    break;
                }
            }
        })
    }, [])

    return ({ apiActionAsync })
}
