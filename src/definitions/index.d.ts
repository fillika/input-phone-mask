interface IRoot {
  state: inputState;
  input: HTMLInputElement;
  defaultConfig: Tconfig;
  config: Tconfig;
}

type Tconfig = {
  mask: string;
  countryCode: number | string;
  prefix: string;
  placeholder: boolean | string;
};

type inputState = {
  value: string;
  myTemplate: regExpConfig[];
  prefix: string;
  globalRegExp: RegExp;
  countryCodeTemplate: string;
  parsedMask: string[];
};

type regExpConfig = {
  length: number;
  regExp: string;
};
