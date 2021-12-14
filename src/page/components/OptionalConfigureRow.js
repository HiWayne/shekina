import { useCallback, useContext, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { Form, Input, Tag, Button, Select, Checkbox } from "antd";
import { Json, ChangeJson } from "../Configure";
import { NotificationError } from "../../utils/common";

const { Item } = Form;
const { Option } = Select;

const SimpleInput = ({
  label,
  field,
  valueType = "string",
  width = "100px",
}) => {
  const json = useContext(Json);
  const value = useMemo(() => json[field], [json, field]);
  const changeJson = useContext(ChangeJson);
  const handleChange = useCallback(
    (e) => {
      let value = e.target.value;
      if (valueType === "number") {
        value = Number(value);
      }
      if (typeof changeJson === "function") {
        changeJson({ [field]: value });
      }
    },
    [changeJson, field, valueType]
  );
  return (
    <Item label={label}>
      <Input value={value} style={{ width }} onChange={handleChange} />
    </Item>
  );
};

const CustomButton = styled(({ className, ...props }) => (
  <Button size="small" className={className} {...props} />
))`
  &:not(:first-of-type) {
    margin-left: 10px;
  }
`;

const CustomSelect = ({ label, options = [], value, onChange }) => {
  return (
    <Item label={label}>
      <Select style={{ width: "100px" }} value={value} onChange={onChange}>
        {options.map((option) => (
          <Option key={option.label} label={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Item>
  );
};

const Equality = () => {
  const [customValue, setCustomValue] = useState("");
  const [customType, setCustomType] = useState("string");
  const json = useContext(Json);
  const equality = useMemo(() => json.equality || [], [json]);
  const changeJson = useContext(ChangeJson);
  const handleCustomChange = useCallback((e) => {
    const value = e.target.value;
    setCustomValue(value);
  }, []);
  const handleCustomTypeChange = useCallback((value) => {
    setCustomType(value);
  }, []);
  const handleClose = useCallback(
    (index) => {
      const newList = equality.slice();
      newList.splice(index, 1);
      changeJson({ equality: newList });
    },
    [equality, changeJson]
  );
  const handleAdd = useCallback(
    (value) => {
      if (equality.includes(value)) {
        return;
      }
      const newList = [...equality, value];
      changeJson({ equality: newList });
    },
    [equality, changeJson]
  );
  const showText = useCallback((value) => {
    switch (value) {
      case null:
        return "null";
      case undefined:
        return "undefined";
      case true:
        return "true";
      case false:
        return "false";
      case "":
        return '""';
      default:
        break;
    }
    if (typeof value === "string") {
      return `"${value}"`;
    } else {
      return value;
    }
  }, []);
  const typeOptions = useMemo(
    () => [
      { value: "string", label: "字符串" },
      { value: "number", label: "数字" },
    ],
    []
  );
  return (
    <Item label="可见性">
      <div>
        <div style={{ marginBottom: "10px" }}>
          {equality.map((tag, index) => (
            <Tag
              color="#2db7f5"
              closable
              onClose={() => handleClose(index)}
              key={showText(tag)}
            >
              {showText(tag)}
            </Tag>
          ))}
        </div>
        <div>
          <CustomButton onClick={() => handleAdd(null)}>+ null</CustomButton>
          <CustomButton onClick={() => handleAdd(undefined)}>
            + undefined
          </CustomButton>
          <CustomButton onClick={() => handleAdd(true)}>+ true</CustomButton>
          <CustomButton onClick={() => handleAdd(false)}>+ false</CustomButton>
          <CustomButton onClick={() => handleAdd("")}>+ ""</CustomButton>
          <div style={{ marginTop: "10px" }}>
            <span style={{ marginLeft: "10px" }}>自定义：</span>
            <CustomSelect
              value={customType}
              onChange={handleCustomTypeChange}
              options={typeOptions}
            />
            <Input
              value={customValue}
              onChange={handleCustomChange}
              style={{ width: "100px" }}
            />
            <Button
              onClick={() => {
                if (!customValue) {
                  return;
                }
                let value = customValue;
                switch (customType) {
                  case "string":
                    break;
                  case "number":
                    value = Number(customValue);
                    break;
                  default:
                    break;
                }
                handleAdd(value);
                setCustomValue("");
              }}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    </Item>
  );
};

const ValueType = () => {
  const json = useContext(Json);
  if (json.namespaceOfValue) {
    return null;
  } else {
    return <SimpleInput label="根字段" field="valueType" />;
  }
};

const Required = () => {
  const json = useContext(Json);
  const { required } = json;
  const change = useContext(ChangeJson);
  const handleChange = useCallback(
    (e) => {
      const value = e.target.checked;
      change({ required: value });
    },
    [change]
  );
  return (
    <Item label="是否必须">
      <Checkbox checked={required} onChange={handleChange} />
    </Item>
  );
};

const Transform = () => {
  const [customValue, setCustomValue] = useState("");
  const json = useContext(Json);
  const { transform = [] } = json;
  const tags = transform.map((name) => ({ name, id: Math.random() + "" }));
  const change = useContext(ChangeJson);
  const handleAdd = useCallback(
    (value) => {
      const newTags = [...tags, { id: Math.random() + "", name: value }];
      change({ transform: newTags.map((tag) => tag.name) });
    },
    [tags, change]
  );
  const showText = useCallback((value) => {
    if (typeof value === "string") {
      switch (value) {
        case "string":
          return "to string";
        case "number":
          return "to number";
        case "array":
          return "to array";
        case "boolean":
          return "to boolean";
        case "null":
          return "empty";
        default:
          return value;
      }
    } else if (value && typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return value.toString();
    }
  }, []);
  const handleClose = useCallback(
    (index) => {
      const newTags = tags.slice();
      newTags.splice(index, 1);
      change({ transform: newTags.map((tag) => tag.name) });
    },
    [tags, change]
  );
  const handleCustomChange = useCallback((e) => {
    const value = e.target.value;
    setCustomValue(value);
  }, []);
  return (
    <Item label="值转换">
      <div>
        <div style={{ marginBottom: "10px" }}>
          {tags.map((tag, index) => (
            <Tag
              color="#2db7f5"
              closable
              onClose={() => handleClose(index)}
              key={tag.id}
            >
              {showText(tag.name)}
            </Tag>
          ))}
        </div>
        <CustomButton onClick={() => handleAdd("string")}>
          to string
        </CustomButton>
        <CustomButton onClick={() => handleAdd("number")}>
          to number
        </CustomButton>
        <CustomButton onClick={() => handleAdd("array")}>to array</CustomButton>
        <CustomButton onClick={() => handleAdd("boolean")}>
          to boolean
        </CustomButton>
        <CustomButton onClick={() => handleAdd("null")}>empty</CustomButton>
        <div style={{ marginTop: "10px" }}>
          <span style={{ marginLeft: "10px" }}>自定义mapjson：</span>
          <Input
            value={customValue}
            onChange={handleCustomChange}
            style={{ width: "100px" }}
          />
          <Button
            onClick={() => {
              if (!customValue) {
                return;
              }
              try {
                const hashMap = JSON.parse(customValue);
                handleAdd(hashMap);
                setCustomValue("");
              } catch (error) {
                NotificationError({
                  message: "json错误",
                  description: (
                    <p style={{ color: "#F56C6C", wordWrap: "break-word" }}>
                      {error.toString()}
                    </p>
                  ),
                  placement: "topRight",
                  duration: 8,
                });
              }
            }}
          >
            确定
          </Button>
        </div>
      </div>
    </Item>
  );
};

const CustomCreateOptions = ({ label, keys, field }) => {
  const json = useContext(Json);
  const options = useMemo(() => json[field] || [], [json, field]);
  const change = useContext(ChangeJson);
  const [values, setValues] = useState([]);
  const handleChange = useCallback(
    (e, index) => {
      const value = e.target.value;
      const newValues = values.slice();
      newValues.splice(index, 1, value);
      setValues(newValues);
    },
    [values]
  );
  const findName = useCallback((value, array) => {
    let index = null;
    for (let i = 0; i < array.length; i++) {
      const obj = array[i];
      const entries = Object.entries(obj);
      for (let j = 0; j < entries.length; j++) {
        const [_, _value] = entries[j];
        if (_value === value) {
          index = i;
          break;
        }
      }
      if (index !== null) {
        break;
      }
    }
    if (index !== null) {
      return array[index].label;
    }
  }, []);
  const checkLegality = useCallback(
    (option, options) => {
      let targetKey = "";
      const hasSame = options.some((_option) => {
        return Object.keys(_option).some((key) => {
          if (_option[key] === option[key]) {
            targetKey = key;
            return true;
          } else {
            return false;
          }
        });
      });
      const name = findName(targetKey, keys);
      return { result: !hasSame, name };
    },
    [keys, findName]
  );
  const handleAdd = useCallback(() => {
    const option = keys.reduce((obj, data, index) => {
      obj[data.value] = values[index];
      return obj;
    }, {});
    const checkResult = checkLegality(option, options);
    if (checkResult.result) {
      const newOptions = [...options, option];
      change({ [field]: newOptions });
      setValues([]);
    } else {
      NotificationError({
        message: "option重复",
        description: (
          <p style={{ color: "#F56C6C", wordWrap: "break-word" }}>
            {checkResult.name}重复
          </p>
        ),
        placement: "topRight",
        duration: 8,
      });
    }
  }, [keys, values, options, change, checkLegality, field]);
  const handleClose = useCallback(
    (index) => {
      const newOptions = options.slice();
      newOptions.splice(index, 1);
      change({ options: newOptions });
    },
    [change, options]
  );
  return (
    <Item label={label}>
      <div>
        <div style={{ marginBottom: "10px" }}>
          {options.map((option, index) => (
            <Tag
              color="#2db7f5"
              closable
              onClose={() => handleClose(index)}
              key={option.value}
            >
              {JSON.stringify(option)}
            </Tag>
          ))}
        </div>
        <div>
          {keys.map((key, index) => (
            <Item key={key.value} label={key.label}>
              <Input
                value={values[index]}
                onChange={(e) => handleChange(e, index)}
                style={{ width: "100px" }}
              />
            </Item>
          ))}
          <Button onClick={handleAdd}>添加</Button>
        </div>
      </div>
    </Item>
  );
};

const MethodSelect = () => {
  const json = useContext(Json);
  const change = useContext(ChangeJson);
  const methodValue = useMemo(() => json.method, [json]);
  const methodOptions = useMemo(
    () => [
      {
        label: "get",
        value: "get",
      },
      {
        label: "post",
        value: "post",
      },
      {
        label: "put",
        value: "put",
      },
      {
        label: "delete",
        value: "delete",
      },
      {
        label: "patch",
        value: "patch",
      },
      {
        label: "postByForm",
        value: "postByForm",
      },
    ],
    []
  );
  const handleMethodChange = useCallback(
    (value) => {
      change({ method: value });
    },
    [change]
  );
  return (
    <CustomSelect
      label="请求方式"
      options={methodOptions}
      value={methodValue}
      onChange={handleMethodChange}
    />
  );
};

export const CommonConfigure = () => (
  <>
    <SimpleInput label="依赖" field="state"></SimpleInput>
    <Equality></Equality>
    <SimpleInput label="值字段" field="value"></SimpleInput>
    <SimpleInput label="父级字段" field="namespaceOfValue"></SimpleInput>
    <ValueType></ValueType>
    <SimpleInput
      label="主体位置偏移"
      field="wrapperOffset"
      valueType="number"
    ></SimpleInput>
  </>
);

// div form row
export const ContainerConfigure = () => (
  <>
    <CommonConfigure />
    <SimpleInput
      label="主体宽度"
      field="wrapperSpan"
      valueType="number"
    ></SimpleInput>
  </>
);

// input
export const InputConfigure = () => (
  <>
    <CommonConfigure />
    <SimpleInput
      label="主体宽度"
      field="wrapperSpan"
      valueType="number"
    ></SimpleInput>
    <SimpleInput
      label="字段名位置偏移"
      field="labelOffset"
      valueType="number"
    ></SimpleInput>
    <SimpleInput
      label="字段名宽度"
      field="labelSpan"
      valueType="number"
    ></SimpleInput>
    <SimpleInput label="字段名" field="label"></SimpleInput>
    <SimpleInput label="默认值" field="defaultValue"></SimpleInput>
    <Required />
    <SimpleInput label="非法提示" field="message"></SimpleInput>
    <Transform />
    <SimpleInput label="影响" field="effect"></SimpleInput>
  </>
);

// select checkbox radio
export const LikeSelectConfigure = () => (
  <>
    <InputConfigure></InputConfigure>
    <CustomCreateOptions
      label="增加可选项"
      keys={[
        { label: "显示名", value: "label" },
        { label: "字段值", value: "value" },
      ]}
      field="options"
    />
    <SimpleInput label="影响" field="effect"></SimpleInput>
  </>
);

// button
export const ButtonConfigure = () => {
  const json = useContext(Json);
  const { action, style } = json;
  const change = useContext(ChangeJson);
  const actionOptions = useMemo(
    () => [
      {
        label: "只影响视图",
        value: undefined,
      },
      {
        label: "普通请求",
        value: "fetch",
      },
      { label: "带有翻页的请求", value: "pagination" },
    ],
    []
  );
  const styleOptions = useMemo(
    () => [
      {
        label: "primary",
        value: "primary",
      },
      {
        label: "ghost",
        value: "ghost",
      },
      {
        label: "dashed",
        value: "dashed",
      },
      {
        label: "link",
        value: "link",
      },
      {
        label: "text",
        value: "text",
      },
      {
        label: "default",
        value: "default",
      },
    ],
    []
  );
  const handleActionChange = useCallback(
    (value) => {
      change({ action: value });
    },
    [change]
  );
  const handleStyleChange = useCallback(
    (value) => {
      change({ style: value });
    },
    [change]
  );
  return (
    <>
      <CommonConfigure />
      <SimpleInput label="文字" field="name"></SimpleInput>
      <CustomSelect
        label="行为"
        options={actionOptions}
        value={action}
        onChange={handleActionChange}
      />
      {action === "fetch" || action === "pagination" ? (
        <>
          <SimpleInput label="请求地址" field="api" width="200px"></SimpleInput>
          <MethodSelect />
        </>
      ) : null}
      {action === "pagination" ? (
        <SimpleInput label="单页数量" field="pageSize"></SimpleInput>
      ) : null}
      <CustomSelect
        label="风格"
        options={styleOptions}
        value={style}
        onChange={handleStyleChange}
      />
      <SimpleInput label="影响" field="effect"></SimpleInput>
    </>
  );
};

const TableOperations = () => {
  const json = useContext(Json);
  const { operations = [] } = json;
  const change = useContext(ChangeJson);
  const handleClose = useCallback(
    (index) => {
      const newOperations = operations.slice();
      newOperations.splice(index, 1);
      change({ operations: newOperations });
    },
    [operations, change]
  );
  const actionOptions = useMemo(
    () => [
      {
        label: "只影响视图",
        value: undefined,
      },
      {
        label: "普通请求",
        value: "fetch",
      },
    ],
    []
  );
  const handleActionChange = useCallback(
    (value) => {
      change({ action: value });
    },
    [change]
  );
  return (
    <>
      <div>
        {operations.map(({ name }, index) => (
          <Tag
            color="#2db7f5"
            closable
            onClose={() => handleClose(index)}
            key={name}
          >
            {name}
          </Tag>
        ))}
      </div>
      <div>
        <SimpleInput label="按钮名" field="name"></SimpleInput>
        <CustomSelect
          label="行为"
          options={actionOptions}
          value={undefined}
          onChange={handleActionChange}
        />
        <SimpleInput label="请求地址" field="api"></SimpleInput>
        <MethodSelect />
        <SimpleInput label="影响" field="effect"></SimpleInput>
      </div>
    </>
  );
};

// table
export const TableConfigure = () => {
  const json = useContext(Json);
  const { rowSelection } = json;
  const change = useContext(ChangeJson);
  const selectOptions = useMemo(
    () => [
      {
        label: "不可选",
        value: undefined,
      },
      {
        label: "可多选",
        value: "checkbox",
      },
      {
        label: "可单选",
        value: "radio",
      },
    ],
    []
  );
  const handleSelectStyleChange = useCallback(
    (value) => {
      change({ rowSelection: value });
    },
    [change]
  );
  return (
    <>
      <TableOperations />
      <CustomCreateOptions
        label="表头"
        keys={[
          { label: "文字", value: "title" },
          { label: "字段", value: "dataIndex" },
          { label: "key", value: "key" },
        ]}
        field="columns"
      />
      <SimpleInput label="依赖" field="state"></SimpleInput>
      <CustomSelect
        label="是否可选中"
        options={selectOptions}
        value={rowSelection}
        onChange={handleSelectStyleChange}
      />
      {rowSelection ? (
        <>
          <SimpleInput label="值字段" field="value"></SimpleInput>
          <SimpleInput label="根字段" field="valueType" />
        </>
      ) : null}
    </>
  );
};

// modal
export const ModalConfigure = () => {
  return (
    <>
      <SimpleInput label="依赖" field="state"></SimpleInput>
      <Equality></Equality>
      <SimpleInput label="请求地址" field="api" width="200px"></SimpleInput>
      <MethodSelect />
    </>
  );
};
