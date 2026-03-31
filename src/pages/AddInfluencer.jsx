import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AddInfluencer() {
  const API = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({
    name: "",
    youtubeUrl: "",
    referralLink: ""
  });

  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const handleSubmit = async () => {
    if (!data.name || !data.youtubeUrl || !data.referralLink) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/influencers`,
        data,
        {
          headers: {
            Authorization: "12345"
          }
        }
      );

      const link = `${window.location.origin}/i/${res.data.slug}`;
      setShareLink(link);

      toast.success("Influencer created!");

    } catch (err) {
      console.error(err);
      toast.error("Unauthorized or error");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4 text-center">
          Admin Panel
        </h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="YouTube URL"
          onChange={(e) => setData({ ...data, youtubeUrl: e.target.value })}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Referral Link"
          onChange={(e) => setData({ ...data, referralLink: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2 rounded text-white transition ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
        >
          {loading ? "Creating..." : "Submit"}
        </button>

        {/* Share Link Section */}
        {shareLink && (
          <div className="mt-4 text-center">
            <p className="text-sm mb-2">Share this link:</p>

            <div className="flex gap-2">
              <input
                value={shareLink}
                readOnly
                className="w-full p-2 border rounded text-sm"
              />
              <button
                onClick={copyLink}
                className="bg-blue-600 text-white px-3 rounded cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AddInfluencer;