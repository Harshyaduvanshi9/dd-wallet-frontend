import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function InfluencerPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  const getEmbedUrl = (url) => {
    try {
      let videoId = "";

      if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }

      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return "";
    }
  };

  useEffect(() => {
    axios.get(`${API}/api/influencers/slug/${slug}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center">

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          {data.name}
        </h1>

        <div className="w-full aspect-video mb-4">
          <iframe
            className="w-full h-full rounded-lg"
            src={getEmbedUrl(data.youtubeUrl)}
            title="YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <a
          href={data.referralLink}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
        >
          Visit Link
        </a>

      </div>
    </div>
  );
}

export default InfluencerPage;