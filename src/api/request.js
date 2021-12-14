import axios from "axios";
import { stringify } from "qs";
import { NotificationError, NotificationSuccess } from "../utils/common";

axios.defaults.withCredentials = true;

const de = (target = {}) => {
  const ks = Reflect.ownKeys(target).filter((key) => {
    return (
      (target[key] || target[key] === 0 || target[key] === false) &&
      !/^__/.test(key)
    );
  });
  const k = ks.reduce((ar, it) => {
    ar[it] = target[it];
    return ar;
  }, {});

  return k;
};

const handleErr = ({ message, status, response }, path) => {
  if (response && response.status === 403) {
    const loginUrl = window.location.origin.replace("operate", "www");
    NotificationError({
      message: "未登录",
      description: (
        <p style={{ color: "#F56C6C", wordWrap: "break-word" }}>
          请前往<a href={loginUrl}>登录</a>
        </p>
      ),
      placement: "topRight",
      duration: 5,
    });
    return;
  }
  NotificationError({
    message: "请求错误",
    description: (
      <>
        <p style={{ color: "#F56C6C", wordWrap: "break-word" }}>
          请求:&nbsp;{path}
        </p>
        <p style={{ wordWrap: "break-word" }}>错误原因: &nbsp;{message}</p>
      </>
    ),
    placement: "topRight",
    duration: 5,
  });
  return Promise.reject({ status, message });
};
export const Get = (path, params, config) => {
  if (params) {
    params = de(params);
    if (Reflect.ownKeys(params).length > 0) {
      path = `${path}?${stringify(params)}`;
    }
  }
  return axios
    .get(path, config)
    .then((response) => response.data)
    .then((json) => {
      if (json.status === 1) {
        return json.data;
      } else {
        return Promise.reject({
          message: json.message,
          status: json.status,
        });
      }
    })
    .catch((err) => handleErr(err, path));
};

export const Post = (path, params, config) => {
  const defaultConfig = {
    credentials: "include",
  };
  const newConfig = { ...defaultConfig, ...config };

  newConfig.headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    ...newConfig.headers,
  };

  newConfig.body = JSON.stringify(newConfig.body);
  if (!(params instanceof FormData)) {
    params = de(params);
  }
  if (
    newConfig.headers["Content-Type"] ===
    "application/x-www-form-urlencoded;charset=UTF-8"
  ) {
    params = stringify(params);
  }
  return axios
    .post(path, params, newConfig)
    .then((response) => response.data)
    .then((json) => {
      json = newConfig.success ? newConfig.success(json) : json;
      if (json.status === 1) {
        NotificationSuccess({
          message: "操作成功",
          placement: "topRight",
          duration: 5,
        });
        return json.data || true;
      } else {
        return Promise.reject({
          message: json.message,
          status: json.status,
        });
      }
    })
    .catch((err) => handleErr(err, path));
};

export const Put = (path, params, config) => {
  const defaultConfig = {
    credentials: "include",
  };
  const newConfig = { ...defaultConfig, ...config };

  newConfig.headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    ...newConfig.headers,
  };

  newConfig.body = JSON.stringify(newConfig.body);
  if (!(params instanceof FormData)) {
    params = de(params);
  }
  if (
    newConfig.headers["Content-Type"] ===
    "application/x-www-form-urlencoded;charset=UTF-8"
  ) {
    params = stringify(params);
  }
  return axios
    .put(path, params, newConfig)
    .then((response) => response.data)
    .then((json) => {
      json = newConfig.success ? newConfig.success(json) : json;
      if (json.status === 1) {
        NotificationSuccess({
          message: "操作成功",
          placement: "topRight",
          duration: 5,
        });
        return json.data || true;
      } else {
        return Promise.reject({
          message: json.message,
          status: json.status,
        });
      }
    })
    .catch((err) => handleErr(err, path));
};

export const Delete = (path, params, config) => {
  const defaultConfig = {
    credentials: "include",
  };
  const newConfig = { ...defaultConfig, ...config };

  newConfig.headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    ...newConfig.headers,
  };

  newConfig.body = JSON.stringify(newConfig.body);
  if (!(params instanceof FormData)) {
    params = de(params);
  }
  if (
    newConfig.headers["Content-Type"] ===
    "application/x-www-form-urlencoded;charset=UTF-8"
  ) {
    params = stringify(params);
  }
  return axios
    .delete(path, { data: params }, newConfig)
    .then((response) => response.data)
    .then((json) => {
      json = newConfig.success ? newConfig.success(json) : json;
      if (json.status === 1) {
        NotificationSuccess({
          message: "删除成功",
          placement: "topRight",
          duration: 5,
        });
        return json.data || true;
      } else {
        return Promise.reject({
          message: json.message,
          status: json.status,
        });
      }
    })
    .catch((err) => handleErr(err, path));
};

export const Patch = (path, params, config) => {
  const defaultConfig = {
    credentials: "include",
  };
  const newConfig = { ...defaultConfig, ...config };

  newConfig.headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    ...newConfig.headers,
  };

  newConfig.body = JSON.stringify(newConfig.body);
  if (!(params instanceof FormData)) {
    params = de(params);
  }
  if (
    newConfig.headers["Content-Type"] ===
    "application/x-www-form-urlencoded;charset=UTF-8"
  ) {
    params = stringify(params);
  }
  return axios
    .patch(path, params, newConfig)
    .then((response) => response.data)
    .then((json) => {
      json = newConfig.success ? newConfig.success(json) : json;
      if (json.status === 1) {
        NotificationSuccess({
          message: "操作成功",
          placement: "topRight",
          duration: 5,
        });
        return json.data || true;
      } else {
        return Promise.reject({
          message: json.message,
          status: json.status,
        });
      }
    })
    .catch((err) => handleErr(err, path));
};

export const PostForm = (...args) => {
  const config = args[2] || {};
  config.headers = {
    ...config.headers,
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };
  args[2] = config;
  return Post(...args);
};

// point free
const createFetch = (method) => (url) => (params) => method(url, params);
export const fetchGet = createFetch(Get);
export const fetchPost = createFetch(Post);
export const fetchPut = createFetch(Put);
export const fetchDelete = createFetch(Delete);
export const fetchPatch = createFetch(Patch);
export const fetchPostByForm = createFetch(PostForm);

export const fetchMap = {
  get: fetchGet,
  post: fetchPost,
  put: fetchPut,
  delete: fetchDelete,
  patch: fetchPatch,
  postByForm: fetchPostByForm,
};
