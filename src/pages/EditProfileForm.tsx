type Props = {
  onCancel: () => void;
};

const EditProfileForm = ({ onCancel }: Props) => {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm max-w-xl">

      <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

      <form className="space-y-4">

        <input type="hidden" value="userId" />

        <div>
          <label className="text-sm">First Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md bg-background"
          />
        </div>

        <div>
          <label className="text-sm">Last Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md bg-background"
          />
        </div>

        <div>
          <label className="text-sm">Full Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md bg-background"
          />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            readOnly
            className="w-full mt-1 p-2 border rounded-md bg-muted cursor-not-allowed"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProfileForm;