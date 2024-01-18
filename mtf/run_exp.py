import docker
import json
import os
import tarfile

client = docker.from_env()

# read config and dataset path from config file
# config_path = input("Enter config path: ")
#
# config = json.load(open(config_path))
#
# dataset_path = config['location']['dataset']
# results_path = config['location']['results']
# trials = config['experiment']['trials']
#
# print(f"Dataset path: {dataset_path}")
# print(f"Results path: {results_path}")
# print(f"Trials: {trials}")
#
# # build args
# buildargs = {
#     'CONFIG_PATH': config_path,
#     'DATASET_PATH': dataset_path,
# }

config_path = "./configs/config_hdi.json"
dataset_path = "./data/HDI.csv"
results_path = "./results"
trials = 2
buildargs = {
    'CONFIG_PATH': config_path,
    'DATASET_PATH': dataset_path,
}

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
    tar.extractall(f'results_{index}')
    tar.close()

  # delete tar
    os.remove(f"results_{index}.tar")

# delete containers
for container in trial_containers:
    container.remove(force=True)

print("Done")
