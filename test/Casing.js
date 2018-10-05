/*globals describe it beforeEach afterEach */
require("should");
var path = require("path"),
 TestHelper = require("./helpers/TestHelper"),
 Watchpack = require("../lib/watchpack"),

 fixtures = path.join(__dirname, "fixtures"),
 testHelper = new TestHelper(fixtures);

 fsIsCaseInsensitive;
try {
	fsIsCaseInsensitive = require("fs").existsSync(path.join(__dirname, "..", "PACKAGE.JSON"));
} catch(e) {
	fsIsCaseInsensitive = false;
}

if(fsIsCaseInsensitive) {

	describe("Casing", function() {
		this.timeout(1000);//this would stablize the aggregate time out betwwen the casing variables
		beforeEach(testHelper.before);
		afterEach(testHelper.after);

		it("should watch a file with the wrong casing", function(done) {
			var w = new Watchpack({
				aggregateTimeout: 1000
			});
			var changeEvents = 0;
			w.on("change", function(file) {
				file.should.be.eql(path.join(fixtures, "a"));
				changeEvents++;
			});
			w.on("aggregated", function(changes) {
				changes.should.be.eql([path.join(fixtures, "a")]);
				changeEvents.should.be.eql(1);
				w.close();
				done();
			});
			w.watch([path.join(fixtures, "a")], []);
			testHelper.tick(function() {
				testHelper.file("A");
			});
		});
	});
}
