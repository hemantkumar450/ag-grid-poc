import { Input, Modal } from "antd";
import React, { useState } from "react";

const ModalBox = (props) => {
  const isModalOpen = props.isModalOpen;
  const setIsModalOpen = props.setIsModalOpen;
  const addOption = props.addOption;

  const [option, setOption] = useState({ value: "", label: "" });

  const handleOk = () => {
    if (option.value.length === 0 || option.label.length === 0) return;
    addOption(option.value, option.label);
    // setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Add Option"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <br />
        <Input
          defaultValue={option.label}
          onInput={(e) => setOption({ ...option, label: e.target.value })}
          placeholder="Enter Label"
        />
        <br />
        <br />
        <Input
          defaultValue={option.value}
          onInput={(e) => setOption({ ...option, value: e.target.value })}
          placeholder="Enter Value"
        />
      </Modal>
    </>
  );
};

export default ModalBox;
