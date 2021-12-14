import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageRender from "../core/index";
import { jsons as _jsons } from "../core/testPageJsons";

const Page = () => {
  const { path } = useParams();
  const [jsons, setJsons] = useState([]);
  useEffect(() => {
    if (!path) {
      const messageHandle = (event) => {
        const jsons = event.data;
        window.parent.console.log(jsons);
        if (Array.isArray(jsons)) {
          setJsons(jsons);
        }
      };
      window.addEventListener("message", messageHandle);
      return () => {
        window.removeEventListener("message", messageHandle);
      };
    }
  }, [path]);
  return (
    <>
      {jsons.length === 0 ? (
        <p style={{ textAlign: "center" }}>页面没有内容</p>
      ) : null}
      <PageRender jsons={jsons}></PageRender>
    </>
  );
};

export default Page;
