import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Table from "../components/Table";
import api from "../api/client";

function Blogs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/blogs");
        setItems(data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <Loader label="Loading blogs..." />;
  }

  return (
    <Table
      columns={[
        { key: "title", label: "Title" },
        { key: "author", label: "Author" },
        { key: "content", label: "Content" },
      ]}
    >
      {items.map((item) => (
        <tr key={item._id} className="text-sm text-slate-600">
          <td className="px-5 py-4 font-semibold text-ink">{item.title}</td>
          <td className="px-5 py-4">{item.author}</td>
          <td className="px-5 py-4 max-w-xl truncate">{item.content}</td>
        </tr>
      ))}
    </Table>
  );
}

export default Blogs;
