import _readXlsxFile from 'read-excel-file';

export const readXlsxFile = _readXlsxFile;
export function handleReadExcel() {
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept =
        '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
      input.setAttribute('type', 'file');
      input.setAttribute(
        'accept',
        '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
      );
      input.addEventListener('change', () => {
        readXlsxFile(input.files[0]).then((rows) => {
          resolve({ excel: rows, files: input.files[0] });
        });
      });
      input.click();
    } catch (error) {
      reject(error);
    }
  });
}
