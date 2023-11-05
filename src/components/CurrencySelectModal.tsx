import React, { useState } from "react";
import { Modal,Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';

interface CurrencySelectModalProps {
  open: boolean;
  onOk: () => unknown | void;
  onCancel: () => unknown | void;
}

export default function CurrencySelectModal(props: CurrencySelectModalProps) {
  const { open, onOk, onCancel  } = props

  return (
    <Modal
      open={open}
      title="Select a token"
      footer={null}
      // onOk={onOk}
      onCancel={onCancel}
    >
       <Input prefix={<SearchOutlined />} placeholder="Search name or address" />
    </Modal>
  )
}
