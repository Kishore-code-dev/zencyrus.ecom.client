import DataGrid from "@/components/data-grid/data-grid";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useTransition } from "react";
import type { UserDetails } from "@/types/users";
import { useApiAction } from "@/hooks/use-api-action";
import { AxiosError } from "axios";
import { api } from "@/config/api";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import UserAddressForm from "./user-address-form";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import ChangePasswordForm from "./change-password-form";



const ProfileView = () =>
{
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const fullName = user?.name || "";

  const nameParts = fullName.trim().split(" ");

  const initials = (
    (nameParts[0]?.charAt(0) || "") +
    (nameParts[1]?.charAt(0) || "")
  ).toUpperCase();

  const { apiActionAsync } = useApiAction()

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, startTransition] = useTransition()

  useEffect(() =>
  {
    startTransition(async () =>
    {
      try
      {
        const response = await api.get("users/getdetails")
        if (response.status == 200 && response.data)
        {
          setUserDetails(response.data.payload)
        }
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response)
        }
      }
    })
  }, [])

  if (loading)
  {
    return (
      <div className="h-full w-full grid grid-cols-1">
        <Spinner className="size-20 m-auto" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account details and preferences
        </p>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-xl">
            {initials || "User"}
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : ""}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>


          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant='default' className="ml-auto">
              Change password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="fixed inset-0 flex items-center justify-center z-50">
              <ChangePasswordForm onCancel={() => setOpen(false)} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card p-5 rounded-xl text-center shadow-sm">
          <h2 className="text-xl font-semibold">{userDetails?.totalOrders}</h2>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </div>

        <div className="bg-card p-5 rounded-xl text-center shadow-sm">
          <h2 className="text-xl font-semibold">₹{userDetails?.walletBalance}</h2>
          <p className="text-sm text-muted-foreground">Wallet Balance</p>
        </div>

        <div className="bg-card p-5 rounded-xl text-center shadow-sm">
          <h2 className="text-xl font-semibold">{userDetails?.activeQuotes}</h2>
          <p className="text-sm text-muted-foreground">Active Quotes</p>
        </div>
      </div> */}

      {/* Business Details */}
      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          BUSINESS DETAILS
        </h3>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">Company</span>
          <span>{userDetails?.companyName}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">GST No.</span>
          <span>{userDetails?.gstNumber}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">Member since</span>
          <span>{userDetails?.memberSince ? format(userDetails.memberSince, "PPP") : "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Status</span>
          <span className="text-green-600 font-medium">{userDetails?.status}</span>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          BILLING INFO
        </h3>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">Mobile</span>
          <span>{userDetails?.mobileNo}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">Address</span>
          <span>{userDetails?.addressLine1} {userDetails?.addressLine2}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">Area</span>
          <span>{userDetails?.city}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">State</span>
          <span>{userDetails?.state}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground text-sm">District</span>
          <span>{userDetails?.district}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Pincode</span>
          <span>{userDetails?.pincode}</span>
        </div>
      </div>
      <DataGrid
        path='customeraddresses'
        viewId="eca1c779-9f7f-da1b-d8f6-12bfad06b541"
      >
        <UserAddressForm />
      </DataGrid>
    </div>
  );
};

export default ProfileView;