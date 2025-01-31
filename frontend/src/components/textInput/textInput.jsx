import styles from "./textInput.module.css";

function TextInput(props) {
  return (
    <div className={styles.textInputWapper}>
      {props.error && (
        <p className={styles.errorMessage}>{props.errormessage}</p>
      )}

      <input type="text" {...props} />
    </div>
  );
}

export default TextInput;
