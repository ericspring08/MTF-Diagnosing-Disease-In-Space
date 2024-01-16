import docker

client = docker.from_env()

# read config and dataset path from config file

config_path = input("Enter config path: ")
dataset_path = input("Enter dataset path: ")

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

# print build logs
for line in client.api.build(path=".", buildargs=buildargs, tag="mtf", decode=True):
    if 'stream' in line:
        print(line['stream'], end='')

# run container
container = client.containers.run("mtf", detach=True, tty=True, remove=True)

# print container logs
for line in container.logs(stream=True):
    print(line.decode('utf-8'), end='')
