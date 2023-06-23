function FormDataMock() {
  this.append = jest.fn();
}
global.FormData = FormDataMock;

process.env.NEXT_PUBLIC_QWACKER_API_URL = 'url/';
