import {
  LocalStorageEnum,
  NavigationEnum,
  NextStepEnum,
  type BaseResponse,
} from "@/types/api-action";
import { AUTH_STORAGE_KEY, notifyAuthStateChanged } from "@/config/auth-storage";
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
        const { data }: { data: BaseResponse<unknown> } = axiosResponse

        if (!data || !('isSuccess' in data) || !Array.isArray(data.actions))
        {
            return;
        }

        // Authentication data must be available before a navigation action renders
        // a protected route. Keep all other action ordering unchanged.
        const orderedActions = [...data.actions].sort((first, second) =>
        {
            if (first.type === NextStepEnum.LOCALSTORAGE && second.type !== NextStepEnum.LOCALSTORAGE)
            {
                return -1;
            }

            if (second.type === NextStepEnum.LOCALSTORAGE && first.type !== NextStepEnum.LOCALSTORAGE)
            {
                return 1;
            }

            return 0;
        });

        for (const action of orderedActions)
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
                        const query = state ? createSearchParams(state).toString() : '';
                        const url = `${baseUrl}${path ? `/${path}` : ''}${query ? `?${query}` : ''}`

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
                                    const serializedValue = JSON.stringify(propertyValue)

                                    if (serializedValue !== undefined)
                                    {
                                        localStorage.setItem(propertyName, serializedValue)
                                    }

                                    break;
                                }
                            case LocalStorageEnum.REMOVE:
                                {
                                    localStorage.removeItem(propertyName)
                                    break;
                                }
                        }

                        if (propertyName === AUTH_STORAGE_KEY)
                        {
                            notifyAuthStateChanged()
                        }
                        break;
                    }
                case NextStepEnum.DIALOGBOX:
                    {
                        const { action, message, icon } = step
                        setDialogBox({ action, message, icon })
                        break;
                    }
            }
        }
    }, [navigate, setDialogBox])

    return ({ apiActionAsync })
}
