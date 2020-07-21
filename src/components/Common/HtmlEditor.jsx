import 'braft-editor/dist/index.css';
import React, { useState } from 'react';
import { Upload } from 'antd';
import { CameraFilled } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ContentUtils } from 'braft-utils';
import { uploadProps } from '@/utils/utils';

const HtmlEditor = props => {
  const { html, callback } = props;
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(html));

  const handleUpoad = param => {
    if (!param.file.response) {
      return false;
    }
    setEditorState(
      ContentUtils.insertMedias(editorState, [
        { type: 'IMAGE', url: param.file.response.data.imageUrl },
      ]),
    );
    return null;
  };

  const controls = [
    'font-size',
    'letter-spacing',
    'bold',
    'italic',
    'underline',
    'strike-through',
    'text-color',
    'separator',
    'list-ul',
    'blockquote',
    'hr',
    'separator',
  ];

  const extendControls = [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload accept="image/*" {...uploadProps} onChange={handleUpoad}>
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            <CameraFilled />
          </button>
        </Upload>
      ),
    },
  ];

  const handleChange = state => {
    setEditorState(state);
    callback(state.toHTML());
  };

  return (
    <BraftEditor
      value={editorState}
      onChange={handleChange}
      controls={controls}
      extendControls={extendControls}
      style={{ border: '1px solid #d9d9d9', borderRadius: 5 }}
    />
  );
};

export default HtmlEditor;
