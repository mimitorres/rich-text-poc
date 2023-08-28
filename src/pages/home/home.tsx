import { classnames } from "helpers/utils";
import globalStyles from "assets/stylesheets/global-styles.module.scss";
import styles from "./home.module.scss";
import { EditorsPick } from "common/editors-pick/editors-pick";
import Editor from "common/lexical-editor/lexical-editor";

const Home = () => (
  <div className={classnames(globalStyles.genericContainer)}>
    <div>
      <EditorsPick />
    </div>
  </div>
);

export { Home };
