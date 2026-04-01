import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function InfluencerPage() {
  const { slug } = useParams();
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 YouTube embed converter
  const getEmbedUrl = (url) => {
    try {
      let videoId = "";

      if (url?.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
      } else if (url?.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    } catch {
      return "";
    }
  };

  // 🔥 Fetch with retry (IMPORTANT for Render)
  const fetchData = async (retry = 0) => {
    try {
      const res = await axios.get(
        `${API}/api/influencers/slug/${slug}`,
        { timeout: 10000 }
      );

      setData(res.data);
      setLoading(false);
    } catch (err) {
      if (retry < 3) {
        setTimeout(() => fetchData(retry + 1), 2000);
      } else {
        setError("Failed to load page. Please try again.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // 🔥 Pre-warm backend
    fetch(API).catch(() => {});
    fetchData();
  }, [slug]);

  // 🔥 Skeleton Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow animate-pulse">

          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>

          <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>

          <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto"></div>

          <p className="text-center mt-4 text-sm text-gray-500">
            Loading... (server waking up)
          </p>

        </div>
      </div>
    );
  }

  // 🔥 Error UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={() => {
            setLoading(true);
            setError("");
            fetchData();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // 🔥 If no data found
  if (!data) {
    return (
      <div className="text-center mt-10">
        <p>Influencer not found</p>
      </div>
    );
  }

  // 🔥 Main UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center">

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          {data.name}
        </h1>

        <div className="w-full aspect-video mb-4">
          {data.youtubeUrl && (
            <iframe
              loading="lazy"
              className="w-full h-full rounded-lg"
              src={getEmbedUrl(data.youtubeUrl)}
              title="YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <a
          href={data.referralLink}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition"
        >
          Visit Link
        </a>

      </div>
    </div>
  );
}

export default InfluencerPage;