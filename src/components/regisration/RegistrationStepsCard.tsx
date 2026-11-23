
import
  {
    UserPlus,
    MailCheck,
    FileCheck,
    Image,
    BadgeCheck,
    ShoppingCart,
  } from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={22} />,
    title: "1. Complete the Registration Form",
    desc: "Provide accurate business details including your Company Name, Email Address, Contact Information, and GST Number (if applicable). Ensure that all information entered is valid, as it will be used for verification and official communication purposes.",
  },
  {
    icon: <MailCheck size={22} />,
    title: "2. Email Address Verification",
    desc: "Upon submission of the registration form, a One-Time Password (OTP) will be sent to your registered email address. Enter the OTP to verify and authenticate your email identity to proceed further.",
  },
  {
    icon: <FileCheck size={22} />,
    title: "3. GST Number Validation",
    desc: "If a GST Number is provided, our administrative team will validate the GST details through official records to ensure compliance and confirm the legitimacy of the registered business entity.",
  },
  {
    icon: <Image size={22} />,
    title: "4. Alternative Business Proof Submission",
    desc: "In case a GST Number is not available, applicants are required to upload supporting business documents such as a Shop Banner photograph and Visiting Card image. These documents will be reviewed manually for business verification.",
  },
  {
    icon: <BadgeCheck size={22} />,
    title: "5. Administrative Review and Approval",
    desc: "After successful verification of submitted details and documents, our administration team will approve or reject the registration request. You will be notified of the approval status via email.",
  },
  {
    icon: <ShoppingCart size={22} />,
    title: "6. Access to Seamless Ordering",
    desc: "Once your registration is approved, you will gain full access to the platform, allowing you to configure products, upload print files, and place orders conveniently through our secure online system.",
  },
];

const RegistrationStepsCard = () =>
{
  return (
    <div className="registration-card">
      <h2 className="card-title">6 Easy Steps for Registration</h2>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className="icon-wrapper">{step.icon}</div>
            <div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationStepsCard;
