/**
 * Small DOM builders for the SCIMAP panels.
 *
 * GeoLibre panels render into a bare `HTMLElement` with no framework, so these
 * return the element plus a typed accessor for its value.
 */

export interface Field<T> {
  element: HTMLElement;
  get(): T;
}

function labelled(labelText: string, control: HTMLElement, hint?: string): HTMLElement {
  const wrapper = document.createElement("label");
  wrapper.className = "scimap-field";

  const span = document.createElement("span");
  span.className = "scimap-field__label";
  span.textContent = labelText;
  wrapper.append(span, control);

  if (hint) {
    const small = document.createElement("small");
    small.className = "scimap-field__hint";
    small.textContent = hint;
    wrapper.append(small);
  }
  return wrapper;
}

/**
 * A raster input: a local file, or an http(s) URL the WASI runner fetches.
 *
 * GeoLibre's plugin API has no documented way to read raster bytes back out of
 * a loaded map layer, so inputs are supplied directly rather than picked from
 * the layer list.
 */
export interface RasterField extends Field<null> {
  read(): Promise<ArrayBuffer | string>;
  hasValue(): boolean;
}

export function rasterField(labelText: string, hint?: string): RasterField {
  const container = document.createElement("div");
  container.className = "scimap-raster";

  const file = document.createElement("input");
  file.type = "file";
  file.accept = ".tif,.tiff,.geotiff,image/tiff";

  const url = document.createElement("input");
  url.type = "url";
  url.placeholder = "or https://… (COG or GeoTIFF)";
  url.className = "scimap-raster__url";

  const status = document.createElement("small");
  status.className = "scimap-raster__status";

  file.addEventListener("change", () => {
    const chosen = file.files?.[0];
    status.textContent = chosen ? `${chosen.name} (${formatBytes(chosen.size)})` : "";
    if (chosen) url.value = "";
  });

  container.append(file, url, status);

  return {
    element: labelled(labelText, container, hint),
    get: () => null,
    hasValue: () => Boolean(file.files?.[0] || url.value.trim()),
    async read() {
      const chosen = file.files?.[0];
      if (chosen) return chosen.arrayBuffer();
      const href = url.value.trim();
      if (href) return href;
      throw new Error(`${labelText} is required.`);
    },
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function numberField(
  labelText: string,
  value: number,
  options: { min?: number; step?: number; hint?: string } = {},
): Field<number> {
  const input = document.createElement("input");
  input.type = "number";
  input.value = String(value);
  if (options.min !== undefined) input.min = String(options.min);
  if (options.step !== undefined) input.step = String(options.step);

  return {
    element: labelled(labelText, input, options.hint),
    get: () => {
      const parsed = Number(input.value);
      return Number.isFinite(parsed) ? parsed : value;
    },
  };
}

export function checkboxField(labelText: string, checked: boolean, hint?: string): Field<boolean> {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;

  const wrapper = document.createElement("label");
  wrapper.className = "scimap-check";
  const span = document.createElement("span");
  span.textContent = labelText;
  wrapper.append(input, span);

  const container = document.createElement("div");
  container.append(wrapper);
  if (hint) {
    const small = document.createElement("small");
    small.className = "scimap-field__hint";
    small.textContent = hint;
    container.append(small);
  }

  return { element: container, get: () => input.checked };
}

export function selectField<T extends string>(
  labelText: string,
  options: ReadonlyArray<readonly [T, string]>,
  initial: T,
  hint?: string,
): Field<T> {
  const select = document.createElement("select");
  for (const [value, text] of options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    select.append(option);
  }
  select.value = initial;

  return {
    element: labelled(labelText, select, hint),
    get: () => select.value as T,
  };
}

/**
 * An editable two-column lookup table, standing in for the QGIS plugin's
 * `QgsProcessingParameterMatrix` remap and weight tables.
 */
export function lookupTable(
  labelText: string,
  headers: [string, string],
  initial: ReadonlyMap<number, number>,
  options: { integerValues?: boolean; rowLabels?: ReadonlyMap<number, string> } = {},
): Field<Array<[number, number]>> {
  const details = document.createElement("details");
  details.className = "scimap-table";

  const summary = document.createElement("summary");
  summary.textContent = labelText;
  details.append(summary);

  const table = document.createElement("table");
  const head = document.createElement("thead");
  head.innerHTML = `<tr><th>${headers[0]}</th><th>${headers[1]}</th></tr>`;
  const body = document.createElement("tbody");
  table.append(head, body);
  details.append(table);

  const rows: Array<[HTMLInputElement, HTMLInputElement]> = [];

  const addRow = (key: number | "", value: number | ""): void => {
    const tr = document.createElement("tr");

    const keyCell = document.createElement("td");
    const keyInput = document.createElement("input");
    keyInput.type = "number";
    keyInput.value = String(key);
    keyCell.append(keyInput);

    const label = options.rowLabels?.get(Number(key));
    if (label) {
      const name = document.createElement("small");
      name.textContent = label;
      keyCell.append(name);
    }

    const valueCell = document.createElement("td");
    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.step = options.integerValues ? "1" : "any";
    valueInput.value = String(value);
    valueCell.append(valueInput);

    tr.append(keyCell, valueCell);
    body.append(tr);
    rows.push([keyInput, valueInput]);
  };

  for (const [key, value] of initial) addRow(key, value);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "scimap-table__add";
  addButton.textContent = "Add row";
  addButton.addEventListener("click", () => addRow("", ""));
  details.append(addButton);

  return {
    element: details,
    get: () => {
      const entries: Array<[number, number]> = [];
      for (const [keyInput, valueInput] of rows) {
        if (keyInput.value === "" || valueInput.value === "") continue;
        const key = Number(keyInput.value);
        const value = Number(valueInput.value);
        if (!Number.isFinite(key) || !Number.isFinite(value)) continue;
        entries.push([Math.trunc(key), options.integerValues ? Math.trunc(value) : value]);
      }
      return entries;
    },
  };
}

export function section(title: string, children: HTMLElement[]): HTMLElement {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "scimap-section";
  const legend = document.createElement("legend");
  legend.textContent = title;
  fieldset.append(legend, ...children);
  return fieldset;
}

/** Progress bar plus a scrolling log, mirroring the QGIS feedback pane. */
export function progressLog(): {
  element: HTMLElement;
  set(progress: number, message?: string): void;
  log(message: string): void;
  reset(): void;
} {
  const container = document.createElement("div");
  container.className = "scimap-progress";

  const bar = document.createElement("progress");
  bar.max = 100;
  bar.value = 0;

  const messages = document.createElement("div");
  messages.className = "scimap-progress__log";

  container.append(bar, messages);

  const log = (message: string): void => {
    const line = document.createElement("div");
    line.textContent = message;
    messages.append(line);
    messages.scrollTop = messages.scrollHeight;
  };

  return {
    element: container,
    set(progress, message) {
      bar.value = Math.max(0, Math.min(100, progress));
      if (message) log(message);
    },
    log,
    reset() {
      bar.value = 0;
      messages.replaceChildren();
    },
  };
}
