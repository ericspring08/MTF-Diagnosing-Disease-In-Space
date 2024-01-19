import docker
import json
import os
import tarfile
import argparse
import shutil

client = docker.from_env()

# parse arguments
parser = argparse.ArgumentParser()

parser.add_argument('--config', type=str,
                    default="./configs/config_cad.json", help='path to config file')

args = parser.parse_args()
config_path = args.config

config = None
# load config
with open(config_path) as f:
    config = json.load(f)
dataset_path = config['location']['dataset']
results_path = config['location']['results']
dataset_path = os.path.relpath(dataset_path, os.getcwd())
results_path = os.path.relpath(results_path, os.getcwd())
trials = config['experiment']['trials']
buildargs = {
    'CONFIG_PATH': config_path,
    'DATASET_PATH': dataset_path,
}

print("Dataset path: ", dataset_path)
print("Results path: ", results_path)
print("Trials: ", trials)

# delete old results_path
if os.path.exists(results_path):
    delete = input("Delete old results? (y/n): ")

    if delete == 'y':
        print("Deleting old results")
        shutil.rmtree(results_path)
    else:
        print("Keeping old results, exiting")
        exit()

# delete extraction_interum
if os.path.exists('./interum_extranction'):
    print("Deleting interum extraction folder")
    for file in os.listdir('./interum_extranction'):
        try:
            shutil.rmtree('./interum_extranction/')
        except Exception as e:
            print(e)

    os.rmdir('./interum_extranction')

# create results folder
if not os.path.exists(results_path):
    os.makedirs(results_path)

# delete old results
for file in os.listdir(results_path):
    file_path = os.path.join(results_path, file)
    try:
        if os.path.isfile(file_path):
            os.unlink(file_path)
    except Exception as e:
        print(e)

# delte old image and container
try:
    client.images.remove("mtf")
    print("Previous Image removed")
except docker.errors.ImageNotFound:
    print("Previous Image not found")


# build image with logs
for line in client.api.build(path=".", buildargs=buildargs, tag="mtf", decode=True, rm=True):
    if 'stream' in line:
        print(line['stream'], end='')

# run trials
trial_containers = []
for i in range(trials):
    # run container
    container = client.containers.run(
        "mtf", detach=True, tty=True)

    trial_containers.append(container)

print(trial_containers)

# print logs
for container in trial_containers:
    for line in container.logs(stream=True):
        print(line.decode('utf-8'), end='')


# copy results
for index, container in enumerate(trial_containers):
    try:
        bits, stat = container.get_archive("/results")
        print(stat)

        with open(f"results_{index}.tar", 'wb') as f:
            for chunk in bits:
                f.write(chunk)
            f.close()

    except docker.errors.APIError:
        print("No results found")
        continue

    # extract results
    tar = tarfile.open(f"results_{index}.tar")
    tar.extractall('./interum_extranction')
    tar.close()

    # move results
    os.rename('./interum_extranction/results',
              f'{results_path}/results_{index}')

    # delete interum folder
    shutil.rmtree('./interum_extranction')

    # delete tar
    os.remove(f"results_{index}.tar")

# delete containers
for container in trial_containers:
    container.remove(force=True)

print("Done")
