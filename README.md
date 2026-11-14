# sisagua-datavis

A website with dashboards that show insights into the SISAGUA data.

## Data provisioning

The script [download_and_filter_data.py](./download_and_filter_data.py) downloads the raw SISAGUA data from its source, unzips is and filters it.
You must have python installed to run it.

First of all, it's highly recommended to run everything python-related in a virtual environment. While staying at the root directory of this repo, run:

```bash
python -m venv .venv
```

Activate the virtual environment:

```bash
source .venv/bin/activate
```

Install the python dependencies:

```bash
pip install -r requirements.txt
```

And finally, run the script. It should download the dataset and save a filtered version of it.

```bash
python download_and_filter_data.py
```
