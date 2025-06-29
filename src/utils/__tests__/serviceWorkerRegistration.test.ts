import { registerServiceWorker } from "../registerServiceWorker";

describe("registerServiceWorker", () => {
  it("registers sw when available", () => {
    const registerMock = jest.fn();
    Object.defineProperty(window.navigator, "serviceWorker", {
      value: { register: registerMock },
      configurable: true,
    });
    registerServiceWorker();
    window.dispatchEvent(new Event("load"));
    expect(registerMock).toHaveBeenCalledWith("/sw.js");
  });
});
