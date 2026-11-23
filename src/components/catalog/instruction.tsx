import printWithUs from "@/assets/print_with.png";
import bleeedIcon from "@/assets/bleed-icon.png";
import trimIcon from "@/assets/trim-icon.png";
import safeIcon from "@/assets/safe-area-icon.png";
import pdf from "@/assets/pdf-icon.png";
import png from "@/assets/png-icon.png";
import jpeg from "@/assets/jpg-icon.png";
import businesCardFormat from "@/assets/business-card-format.png";

export const Instruction = () =>
{
  return (
    <div className="w-full bg-white border rounded-lg p-6">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT – Image / Diagram */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Tips for Printing With Us
          </h2>

          <div className="border rounded-md p-3 flex justify-center">
            {/* Replace src with your actual image */}
            <img
              loading="lazy"
              decoding="async"
              src={printWithUs}
              alt="Printing Guide"
              className="max-w-full h-auto"
            />
          </div>
        </div>

        {/* MIDDLE – Specifications */}
        <div className="space-y-6">
          {/* Bleed */}
          <div className="flex gap-3">
            <div className="w-20 h-10  border-yellow-500 mt-1">
              <img
                loading="lazy"
                decoding="async" src={bleeedIcon} alt="bleed" />
            </div>
            <div className="ml-5">
              <p className="font-semibold text-black">
                Bleed: 3.543&quot; (90MM) x 2.087&quot; (53MM)
              </p>
              <p className="text-sm text-black">
                Make sure that your background extends to fill the bleed to
                avoid your Business Cards having white edges when trimmed.
              </p>
            </div>
          </div>

          {/* Trim */}
          <div className="flex gap-3">
            <div className="w-20 h-10  border-yellow-500 mt-1">
              <img
                loading="lazy"
                decoding="async" src={trimIcon} alt="trim" />
            </div>
            <div className="ml-1">
              <p className="font-semibold text-black">
                Trim: 3.386&quot; (86MM) x 1.93&quot; (49MM)
              </p>
              <p className="text-sm text-black">
                Your cards will be cut within this space. Keep important info
                away from the trim.
              </p>
            </div>
          </div>

          {/* Safe Area */}
          <div className="flex gap-3">
            <div className="w-20 h-10  border-yellow-500 mt-1">
              <img
                loading="lazy"
                decoding="async" src={safeIcon} alt="safe Area" />
            </div>
            <div className="ml-0">
              <p className="font-semibold text-black">
                Safe Area: 3.229&quot; (82MM) x 1.773&quot; (45MM)
              </p>
              <p className="text-sm text-black">
                Keep all information in the safety zone to prevent it from being
                cut off.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT – File Format Specifications */}
        <div className="border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">
            File Format Specifications
          </h3>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Resolution:</span> 300dpi
            </p>
            <p>
              <span className="font-semibold">File Types:</span> You may upload
              a number of different file types:
            </p>
          </div>

          {/* Icons */}
          <div className="flex gap-4 mt-6 justify-center text-center">
            <div className="flex justify-between gap-4">
              <div
                className="flex flex-col items-center justify-center
                           w-20 h-20 bg-gray-100 rounded-md"
              >
                <img
                  loading="lazy"
                  decoding="async" src={pdf} alt="PDF" />
                <span className="text-sm font-semibold">PDF</span>
              </div>
              <div
                className="flex flex-col items-center justify-center
                           w-20 h-20 bg-gray-100 rounded-md"
              >
                <img
                  loading="lazy"
                  decoding="async" src={png} alt="PNG" />
                <span className="text-sm font-semibold">PNG</span>
              </div>

              <div
                className="flex flex-col items-center justify-center
                           w-20 h-20 bg-gray-100 rounded-md"
              >
                <img
                  loading="lazy"
                  decoding="async" src={jpeg} alt="JPG" />
                <span className="text-sm font-semibold">JPG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img
          loading="lazy"
          decoding="async" src={businesCardFormat} alt="Business Card Format" />
      </div>
    </div>
  );
};
