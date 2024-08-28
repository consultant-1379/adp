import json
import sys

class Versions:

	def __init__(self):
		self.current=None
		self.next=None

	def load(self, filename):
		versions={}
		with open(filename) as version_file:
			versions = json.loads(version_file.read())
		if not ("current" in versions and "next" in versions):
			print "ERROR invalid input file"
			sys.exit(1)
		self.current=versions["current"]
		self.next=versions["next"]

	def write(self, filename):
		versions={}
		versions["next"]=self.next
		versions["current"]=self.current
		with open(filename,"w+") as version_file:
			version_file.write(json.dumps(versions))

	def to_next(self):
		before = self.current
		self.current=self.next
		after = self.current
		print "Incrementing current version from {0} to {1}".format(before,after)
		self.inc_patch()

	def inc_pos(self, input, pos):
		v = input.split(".")
		v[pos]=str(int(v[pos])+1)
		return ".".join(v)

	def pos_reset(self, input, pos):
		v = input.split(".")
		v[pos]=str(0)
		return ".".join(v)

	def inc_patch(self):
		before = self.next
		self.next=self.inc_pos(self.next,2)
		after = self.next
		print "Incrementing next version from {0} to {1}".format(before,after)

	def inc_minor(self):
		before = self.next
		self.next=self.inc_pos(self.next,1)
		self.next=self.pos_reset(self.next,2)
		after = self.next
		print "Incrementing next version from {0} to {1}".format(before,after)

	def inc_major(self):
		before = self.next
		self.next=self.inc_pos(self.next,0)
		self.next=self.pos_reset(self.next,1)
		self.next=self.pos_reset(self.next,2)
		after = self.next
		print "Incrementing next version from {0} to {1}".format(before,after)

if __name__ == "__main__":
	import sys
	vm = Versions()
	usage="Usage: version_manager.py <config_file> <action [i|p|m|M]>\n\
i: Move current to next and patch increment next.\n\
  If next is 1.1.0 and current is 1.0.0, current => 1.1.0 and next => 1.1.1\n\
p: Patch increment the next version, make no change to current.\n\
m: Minor increment the next version, make no change to current.\n\
M: Major increment the next version, make no change to current.\
"
	if len(sys.argv)==3:
		conf_file = sys.argv[1]
		action = sys.argv[2]

		vm.load(conf_file)
		if action=="i":
			vm.to_next()
			vm.write(conf_file)
		elif action=="p":
			vm.inc_patch()
			vm.write(conf_file)
		elif action=="m":
			vm.inc_minor()
			vm.write(conf_file)
		elif action=="M":
			vm.inc_major()
			vm.write(conf_file)
		elif action == "y":
			print vm.current
		else:
			print "ERROR: invalid action"
			print usage
			sys.exit(1)
	else:
		print usage