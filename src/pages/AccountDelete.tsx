const AccountDeletionPolicy = () =>
{
    return (
        <div>
            <section className="hero-gradient py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="font-display text-4xl font-bold sm:text-5xl">
                        Account Deletion Policy
                    </h1>
                </div>
            </section>
            <section className="p-10">
                <span className="text-lg font-semibold mb-4">
                    Policy for Account Deletion
                </span>
                <p className="text-justify leading-8 mb-4">
                    Gokul Printers respects your right to request deletion of your
                    account at any time. When you request account deletion, we will
                    permanently remove your personal details, including your name, contact
                    number, email address, saved addresses, and login credentials, from
                    our active systems within a reasonable period of time.
                    <br />
                    Once your account is deleted, you will no longer be able to log in or
                    access any personalized features associated with your account.
                </p>

                <span className="text-lg font-semibold mb-4">
                    Data We Retain After Deletion
                </span>
                <p className="text-justify leading-8 mb-4">
                    While your personal account details are deleted, we are required to
                    retain certain records for legal, accounting, tax, fraud-prevention,
                    and dispute-resolution purposes. This includes your order history,
                    payment and transaction records, and wallet history. This information
                    is retained in accordance with applicable law and our record-keeping
                    obligations, and is not linked back to an active, usable account once
                    deletion is complete.
                    <br />
                    This retained data will not be used for any marketing or promotional
                    purposes after your account has been deleted.
                </p>

                <span className="text-lg font-semibold mb-4">
                    How to Request Account Deletion
                </span>
                <p className="text-justify leading-8 mb-4">
                    To request deletion of your account, please contact our customer
                    support team with your registered email address or phone number for
                    verification. You are requested to drop a call at{" "}
                    <a href="tel:04224229800" className="text-blue-600 underline">
                        0422-4229800
                    </a>{" "}
                    or drop an email at{" "}

                    <a href="mailto:support@gokulprinters.com"
                        className="text-blue-600 underline"
                    >
                        support@gokulprinters.com
                    </a>{" "}
                    with the subject line "Account Deletion Request".
                    <br />
                    We will process your request and confirm once your personal details
                    have been deleted from our systems. Please note that records related to
                    order history, payment transactions, and wallet history, as mentioned
                    above, will continue to be retained as required by law.
                </p>
            </section>
        </div >
    );
};

export default AccountDeletionPolicy;