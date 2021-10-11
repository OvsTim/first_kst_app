import i18n from './../utils/i18n';

interface SerializedError {
  name?: string;
  message: string;
  code: string;
  stack?: string;
}

function instanceOfSerializedError(er: any): er is SerializedError {
  return 'code' in er && 'message' in er;
}

export function handleBaseError(er: any): string {
  console.log('er', er);

  if (instanceOfSerializedError(er)) {
    return er.message;
  }

  //todo: обработать серверную ошибку

  return i18n.t('errors:400');
}
