import { useField } from "formik";

const CustomTextInput = ({ ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <input disabled={!!props.disable} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default CustomTextInput;
