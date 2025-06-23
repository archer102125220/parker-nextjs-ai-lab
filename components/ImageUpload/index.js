import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from '@/components/ImageUpload/styles.module.scss';

export function ImageUpload(props) {
  const {
    previewBgColor = '#fff',
    width,
    height,
    disable,
    src,
    fileCheck,
    fileTypeError,
    change,
    btnLabel = '上傳圖片',
    label = '點擊或拖拉圖片到此區塊上傳',
    maskLabel = '拖拉圖片到此區塊上傳',
  } = props;
  const [cssVariable, setCssVariable] = useState({});
  const [value, setValue] = useState('');
  const [showMask, setShowMask] = useState(false);
  const [previewImg, setPreviewImg] = useState('');

  const handlePreviewImg = useCallback((newPreviewImg) => {
    const reader = new FileReader();
    reader.addEventListener('load', function (e) {
      setPreviewImg(e.target.result);
    });
    reader.readAsDataURL(newPreviewImg);
  }, []);
  const handleFileReader = useCallback((e, _file, needAsync = true) => {
    const file = e?.target?.files?.[0] || _file;

    if (typeof file !== 'object' || file === null) return;
    const URL = window.URL || window.webkitURL;
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.addEventListener('load', async function (e) {
      file.width = e.target.width;
      file.height = e.target.height;

      let fileChecked = true;
      if (typeof fileCheck === 'function') {
        fileChecked = await fileCheck(file);
      }
      if (fileChecked !== true) {
        // if (typeof fileChecked === 'string' && fileChecked !== '') {
        //   emit('fileTypeError', fileChecked);
        // }
        if (
          typeof fileTypeError === 'function' &&
          typeof fileChecked === 'string' &&
          fileChecked !== ''
        ) {
          fileTypeError(fileChecked);
        }
        return;
      }
      if (needAsync === true) {
        // console.log({ file });
        // emit('change', file);
        if (typeof change === 'function') {
          change(file);
        }
        // modelValue.value = file;
        setValue(file);
      }
      handlePreviewImg(file);

      URL.revokeObjectURL(objectUrl);
    });
    img.src = objectUrl;
  }, [fileCheck, fileTypeError, change, handlePreviewImg]);
  const handeChange = useCallback(() => {
    if (disable === true) return;
    const fileSelector = document.createElement('input');
    fileSelector.type = 'file';
    fileSelector.setAttribute('accept', 'image/*');
    fileSelector.addEventListener('change', handleFileReader);
    fileSelector.click();
  }, [disable, handleFileReader]);
  const handeTirgger = useCallback((e) => {
    e.stopPropagation();
    handeChange();
  }, [handeChange]);

  // https://hackmd.io/@c36ICNyhQE6-iTXKxoIocg/HkSdHcJ9U
  const dragenter = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowMask(true);
  }, []);
  const dragover = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (disable === true) return;
    // console.log('dragover');
  }, [disable]);
  const dragleave = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (disable === true) return;
    setShowMask(false);
  }, [disable]);
  const drop = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (disable === true) return;
    const dt = e.dataTransfer;
    const file = dt.files[0];

    const URL = window.URL || window.webkitURL;
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.addEventListener('load', async function (e) {
      file.width = e.target.width;
      file.height = e.target.height;

      if (typeof fileCheck === 'function') {
        const fileChecked = await fileCheck(file);
        if (fileChecked === false) return;
      }
      // emit('change', file);
      if (typeof change === 'function') {
        change(file);
      }
      // modelValue.value = file;
      setValue(file);
      handlePreviewImg(file);

      URL.revokeObjectURL(objectUrl);
    });
    img.src = objectUrl;

    setShowMask(false);
  }, [disable, fileCheck, change, handlePreviewImg]);

  useEffect(() => {
    const _cssVariable = { '--preview_bg_color': previewBgColor };

    if (typeof width === 'number') {
      _cssVariable['--image_upload_width'] = `${width}px`;
    }
    if (typeof height === 'number') {
      _cssVariable['--image_upload_height'] = `${height}px`;
    }

    if (previewImg !== '') {
      _cssVariable['--preview_opacity'] = 1;
    } else {
      _cssVariable['--preview_opacity'] = 0;
    }

    if (showMask === true) {
      _cssVariable['--mask_opacity'] = 0.8;
    } else {
      _cssVariable['--mask_opacity'] = 0;
    }

    if (disable === true) {
      _cssVariable['--image_upload_cursor'] = 'not-allowed';
    }
    setCssVariable(_cssVariable);
  }, [previewBgColor, width, height, previewImg, showMask, disable]);

  useEffect(() => {
    const newValue = src || value;
    if (typeof newValue === 'string' && newValue !== '') {
      setPreviewImg(newValue);
    } else if (typeof newValue === 'object' && newValue !== null) {
      handleFileReader(null, newValue, false);
    }
  }, [src, value, handleFileReader]);


  return <Button
    component='div'
    className={styles.image_upload}
    style={cssVariable}
    onClick={handeChange}
    onDragEnter={dragenter}
    onDragOver={dragover}
    onDrop={drop}
    onDragLeave={dragleave}
  >
    <Button
      color="primary"
      variant="tonal"
      className={styles['image_upload-btn']}
      onClick={handeTirgger}
    >
      {btnLabel}
    </Button>

    <label className={styles['image_upload-label']}>
      {label}
    </label>

    <div className={styles['image_upload-preview']}>
      {previewImg && <Image
        className={styles['image_upload-preview-img']}
        src={previewImg}
        alt='preview-img'
        width={width}
        height={height}
      />}
    </div>

    <div
      className={styles['image_upload-mask']}
      style={{
        '--mask_opacity': showMask === true ? '0.8' : '',
        cursor: disable === true ? ' not-allowed' : ''
      }}
    >
      <p>{maskLabel}</p>
    </div>
  </Button>;
}


ImageUpload.propTypes = {
  btnLabel: PropTypes.string,
  label: PropTypes.string,
  maskLabel: PropTypes.string,
  src: [PropTypes.object, PropTypes.string],
  previewBgColor: PropTypes.string,
  maxSize: PropTypes.number, //  2 * 1024 * 1024
  fileCheck: PropTypes.func,
  disable: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number
};

ImageUpload.defaultProps = {
  btnLabel: '上傳圖片',
  label: '點擊或拖拉圖片到此區塊上傳',
  maskLabel: '拖拉圖片到此區塊上傳',
  src: '',
  previewBgColor: '#fff',
  maxSize: null, //  2 * 1024 * 1024
  fileCheck: null,
  disable: false,
  width: 500,
  height: 500,
};

export default ImageUpload;