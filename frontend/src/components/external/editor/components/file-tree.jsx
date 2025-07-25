import React, {useState} from 'react'
import {sortDir, sortFile} from "../utils/file-manager";
import {getIcon} from "./icon";
import styled from "@emotion/styled";


export const FileTree = (props) => {
  return <SubTree directory={props.rootDir} {...props}/>
}


const SubTree = (props) => {
  return (
    <div>
      {
        props.directory.dirs
          .sort(sortDir)
          .map(dir => (
            <React.Fragment key={dir.id}>
              <DirDiv
                directory={dir}
                selectedFile={props.selectedFile}
                onSelect={props.onSelect}/>
            </React.Fragment>
          ))
      }
      {
        props.directory.files
          .sort(sortFile)
          .map(file => (
            <React.Fragment key={file.id}>
              <FileDiv
                file={file}
                selectedFile={props.selectedFile}
                onClick={() => props.onSelect(file)}/>
            </React.Fragment>
          ))
      }
    </div>
  )
}

const FileDiv = ({file, icon, selectedFile, onClick}) => {
  const isSelected = (selectedFile && selectedFile.id === file.id) ;
  const depth = file.depth;
  return (
    <Div
      depth={depth}
      isSelected={isSelected}
      onClick={onClick}>
      <FileIcon
        name={icon}
        extension={file.name.split('.').pop() || ""}/>
      <span style={{marginLeft: 1}}>
        {file.name}
      </span>
    </Div>
  )
}


const Div = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.depth * 16}px;
  background-color: ${(props) => (props.isSelected ? "#242424" : "transparent")};

  :hover {
    cursor: pointer;
    background-color: #242424;
  }
`;

const DirDiv = ({ directory, selectedFile, onSelect }) => {
  let defaultOpen = false;
  if (selectedFile) {
    defaultOpen = isChildSelected(directory, selectedFile);
  }
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <FileDiv
        file={directory}
        icon={open ? "openDirectory" : "closedDirectory"}
        selectedFile={selectedFile}
        onClick={() => {
          if (!open) {
            onSelect(directory);
          }
          setOpen(!open);
        }}
      />
      {open ? (
        <SubTree
          directory={directory}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      ) : null}
    </>
  );
};

const isChildSelected = (directory, selectedFile) => {
  let res = false;

  function isChild(dir, file) {
    if (selectedFile.parentId === dir.id) {
      res = true;
      return;
    }
    if (selectedFile.parentId === "0") {
      res = false;
      return;
    }
    dir.dirs.forEach((item) => {
      isChild(item, file);
    });
  }

  isChild(directory, selectedFile);
  return res;
};

const FileIcon = ({ extension, name }) => {
  let icon = getIcon(extension || "", name || "");
  return (
    <Span>
      {icon}
    </Span>
  );
};

const Span = styled.span`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

export default DirDiv;