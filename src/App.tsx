import { lazy, Suspense, useEffect } from "react"
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { CartProvider } from "./providers/cart-context-provider";
import { WishListProvider } from "./providers/wishlist-context-provider";
import AuthProvider from "./providers/auth-provider";
import AppProtectedLayout from "./layouts/AppProtectedLayout";
import GlobalAlertBoxProvider from "./providers/global-alert-box-provider";
import AppRootLayout from "./layouts/AppRootLayout";
import ChangePasswordCard from "./components/auth/change-password/change-password-card";
import ForgotPasswordCard from "./components/auth/forgot-passsword/forgot-password-card";

const Index = lazy(() => import("./pages/Index"));
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQ = lazy(() => import("./pages/Faq"));
const Termsandcondition = lazy(() => import("./pages/termsandcondition"));
const Register = lazy(() => import("./pages/Register"))
// const CustomQuote = lazy(() => import("./pages/CustomQuote"));
// const CustomQuotePlaceOrder = lazy(() => import("./pages/CustomQuotePlaceOrder"));
const Profile = lazy(() => import("./pages/Profile"));
const InvalidLink = lazy(() => import("./pages/InvalidLink"));
const OnboardInfo = lazy(() => import("./pages/OnboardInfo"));
const OrderComplete = lazy(() => import("./pages/OrderComplete"));
const CustomizedProductDetail = lazy(() => import("./pages/ProductDetailDynamicConfiguration"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ReturnCancellationPolicy = lazy(() => import("./pages/ReturnCancellationPolicy"));
const Invoice = lazy(() => import("./pages/Invoice"));
const OrderPaymantFailed = lazy(() => import("./pages/OrderPaymantFailed"));
const OrderCancel = lazy(() => import("./pages/OrderCancel"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const EnquiryPage = lazy(() => import("./pages/Enquiry-Page"));
import './index.css'
import FallBackSkeleton from "./components/FallBackSkeleton";
import LogInAsCustomer from "./pages/LogInAsCustomer";
import PageTracker from "./analytics/pageTracker";
import WhatsappFloatingBtn from "./components/WhatsappFloatingBtn";
import AccountDelete from "./pages/AccountDelete";
function ScrollToTop()
{
  const { pathname } = useLocation();

  useEffect(() =>
  {
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
  }, [pathname]);

  return null;
}

const App = () => (

  <Suspense fallback={<FallBackSkeleton />}>
    <TooltipProvider>
      <GlobalAlertBoxProvider>
        <BrowserRouter>
          <PageTracker />
          <AuthProvider>
            <WishListProvider>
              <CartProvider>
                <Toaster position="top-center" />
                <ScrollToTop />
                <Routes>
                  <Route path="/account/delete" Component={AccountDelete} />
                  <Route Component={AppRootLayout}>
                    <Route path="/" Component={Index} />
                    <Route path="/catalog" Component={Catalog} />
                    {/* <Route path="/customquote" Component={CustomQuote} /> */}
                    {/* <Route path="/customquote/placeorder/:customJobId" Component={CustomQuotePlaceOrder} /> */}
                    <Route path="/enquiry" Component={EnquiryPage} />
                    <Route path="/contact" Component={Contact} />
                    <Route path="/faq" Component={FAQ} />
                    <Route path="/invoice/:orderRef" Component={Invoice} />
                    <Route path="/orders/:orderId" Component={OrderDetails} />
                    <Route path="/termsandconditions" Component={Termsandcondition} />
                    <Route path="/privacypolicy" Component={PrivacyPolicy} />
                    <Route path="/returncancellationpolicy" Component={ReturnCancellationPolicy} />
                    <Route path="/product/:id/:quantityId" Component={ProductDetail} />
                    <Route path="/product/dynamicconfiguration/:productId" Component={CustomizedProductDetail} />
                    <Route Component={AppProtectedLayout}>
                      <Route path="/cart" Component={Cart} />
                      <Route path="/profile" Component={Profile} />
                      <Route path="/checkout" Component={Checkout} />
                      <Route path="/orders" Component={OrderHistory} />
                      <Route path="/wallet" Component={Wallet} />
                      <Route path="/order/:orderId/complete" Component={OrderComplete} />
                      <Route path="/order/:orderId/paymentfailed" Component={OrderPaymantFailed} />
                      <Route path="/order/cancel" Component={OrderCancel} />
                    </Route>
                  </Route>
                  <Route path="/auth/loginascustomer/:customerId" Component={LogInAsCustomer} />
                  <Route path="/auth/login" Component={Login} />
                  <Route path="/auth/register" Component={Register} />
                  <Route path="/forgot-password" Component={ForgotPasswordCard} />
                  <Route path="/auth/change-password/:securityKey" Component={ChangePasswordCard} />
                  <Route path="/auth/invalid-link" Component={InvalidLink} />
                  <Route path="/onboard/info" Component={OnboardInfo} />
                  <Route path="*" Component={NotFound} />
                </Routes>
              </CartProvider>
            </WishListProvider>
          </AuthProvider>
        </BrowserRouter>
      </GlobalAlertBoxProvider>
    </TooltipProvider>
    <WhatsappFloatingBtn />
  </Suspense>
);

export default App;
