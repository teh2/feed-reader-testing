/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
		 it('contain urls', function() {
			allFeeds.forEach(function(feed) {
				expect(feed.url).toBeDefined();
				expect(feed.url.length).toBeGreaterThan(0);
			});
		 });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
		 it('have names', function() {
			allFeeds.forEach(function(feed) {
				expect(feed.name).toBeDefined();
				expect(feed.name.length).toBeGreaterThan(0);
			});
		 });
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
		 it('is hidden by default', function() {
			var theMenu = document.querySelector('.menu');
			expect(theMenu.classList.contains('hidden')).toBeTruthy();
		 });

         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
		 it('displays when clicked', function() {
			var theMenu = document.querySelector('.menu-icon-link');
			var theBody = document.querySelector('body');
			expect(theBody.classList.contains('menu-hidden')).toBeTruthy();
			theMenu.click();
			expect(theBody.classList.contains('menu-hidden')).toBeFalsy();
			theMenu.click();
			expect(theBody.classList.contains('menu-hidden')).toBeTruthy();
		 });
	});

    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {

        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test wil require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
		 beforeEach(function(done) {
			loadFeed(0, done);
		 });
		 
		 it('should have entries', function(done) {
			var theFeed = document.querySelector('.feed');
			var theEntries = theFeed.children;
			expect(theEntries.length).toBeGreaterThan(0);
			done();
		 });
	});

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
		 var firstText;

		 beforeEach(function(done) {
			firstText = document.querySelector('.feed').children[0].text;
			loadFeed(1, done);
		 });

		 it('should change the entries', function(done) {
			var secondText = document.querySelector('.feed').children[0].text;
			expect(firstText).not.toEqual(secondText);
			done();
		 });
	});
	
	/* Below this line, we have other tests that I wrote just for the fun of exploring
		Jasmine a little deeper... */
	
	/* First, a custom matcher, for checking feed entries; just to check out how
		custom matchers work... 
		This is seriously contrived, but I wanted to write 'toHaveEntries', so
		I ignore the expected and dig into the actual.
		Actually, in hindsight, this would be perfectly named if it were called
		'toHaveChildren', in which case, it might have some measure of general
		usefulness. */
	//So, first we build our matcher:
	var customMatchers = {
		toHaveEntries: function(util, customEqualityTesters) {
			return {
				compare: function(actual, expected) {
					var result = {};
					if (actual === undefined) {
						result.pass = false;
						result.message = actual + " is undefined";
						return result;
					}
					result.pass = actual.children.length > 0;
					if (result.pass) {
						result.message = "Expected " + actual + " to have entries, and it had " + actual.children.length;
					} else {
						result.message = "Expected " + actual + " to have entries, but it did not."
					};
					return result;
				}
			}
		}
	};
	//And then we use our matcher in some tests:
	describe('Initial Entries with custom matcher', function() {
		 beforeEach(function(done) {
			jasmine.addMatchers(customMatchers);
			done();
		 });
		 
		 it('should have entries', function(done) {
			loadFeed(0, done);
			var theFeed = document.querySelector('.feed');
			expect(theFeed).toHaveEntries();
		 });
		 
		 it('should not have entries', function(done) {
			var theFeed = document.querySelector('.feed');
			expect(theFeed).toHaveEntries();
			done();
		 });
	});
		
	/* Now, how about a spy, just to see what it does. Not exploring very deeply here, there are a boatload of possibilities... */
	describe('Lets spy on loadFeed', function() {
		beforeEach(function() {
			spyOn(window, 'loadFeed');
			loadFeed(0);
			loadFeed(1);
		});
		
		it('should have been called', function() {
			expect(window.loadFeed).toHaveBeenCalled();
		});
		it('parameters should have been zero and one', function() {
			expect(window.loadFeed.calls.count()).toEqual(2);
			expect(window.loadFeed).toHaveBeenCalledWith(0);
			expect(window.loadFeed).toHaveBeenCalledWith(1);
		});
	});
}());
