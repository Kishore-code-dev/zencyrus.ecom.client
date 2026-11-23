const ContactCards = () => {
  return (
    <div className="flex w-full ">
      <div className="flex gap-5 flex-wrap justify-items-center bg-background rounded-xl shadow-sm border border-border p-2.5">
        {/* VISITING CARD JOBS */}
        <div>
          <h3 className="font-semibold text-lg text-primary">
            Visiting Cards Jobs
          </h3>
          <p>
            <strong className="text-sm">Email:</strong> jobstosmp@gmail.com <br />
            <strong className="text-sm">Phone:</strong> 0422-4229824
          </p>
        </div>

        {/* OTHER JOBS */}
        <div>
          <h3 className="font-semibold text-lg text-primary">Other Jobs</h3>
          <p>
            <strong className="text-sm">Email:</strong> jobstosmp@gmail.com <br />
            <strong className="text-sm">Phone:</strong> 0422-4229826 / 4229827
          </p>
        </div>

        {/* QUOTATION */}
        <div>
          <h3 className="font-semibold text-lg text-primary">
            Quotation of Jobs
          </h3>
          <p>
            0422-4229831 <br />
            09943046761 / 09952566366 / 08870006761
          </p>
        </div>

        {/* ACCOUNTS */}
        <div>
          <h3 className="font-semibold text-lg text-primary">Accounts</h3>
          <p>
            0422-4229802 to 4229804 <br />
            09790007888 / 08220016761
          </p>
        </div>

        {/* DISPATCH */}
        <div>
          <h3 className="font-semibold text-lg text-primary">Local Dispatch</h3>
          <p>0422-4229809</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-primary">
            Out Station Dispatch
          </h3>
          <p>
            0422-4229814 / 4229815 <br />
            09952406761
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactCards;
