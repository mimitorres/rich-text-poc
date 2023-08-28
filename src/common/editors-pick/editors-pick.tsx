import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Editor from "common/lexical-editor/lexical-editor";
import { TiptapEditor } from "common/tiptap-editor/tiptap-editor";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const EditorsPick = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(parseInt(newValue));
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Lexical" />
          <Tab label="Tiptap" />
        </Tabs>
      </Box>
      <CustomTabPanel value={activeTab} index={0}>
        <Editor />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1}>
        <TiptapEditor />
      </CustomTabPanel>
    </>
  );
};
