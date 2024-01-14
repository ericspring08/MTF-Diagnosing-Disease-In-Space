import docker

client = docker.from_env()

buildargs = {
    'config': './configs/config_cad.json',
    'dataset': './data/CADE.csv'
}

# print build logs
for line in client.api.build(path=".", buildargs=buildargs, tag="mtf", decode=True, nocache=True):
    if 'stream' in line:
        print(line['stream'], end='')

# run container
container = client.containers.run("mtf", detach=True, tty=True, remove=True)

# print container logs
for line in container.logs(stream=True):
    print(line.decode('utf-8'), end='')
