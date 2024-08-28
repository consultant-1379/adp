describe('Testing results of [ stripHTMLTags ] ', () => {
  const stripHtmlTags = require('./stripHtmlTags');

  it('Test case which checks: Space between words, Non-HTML tags ', (done) => {
    const html = '<strong>This is </strong> <sub>first</sub> <a>demo</a> <<>> <<<</>> test >>> after <<< multiple                space <>removing <nonhtml thnl> Non HTML</nonhtml>';
    const result = stripHtmlTags(html);

    expect(result).toEqual('<strong>This is </strong> <sub>first</sub> demo > > test >>> after removing Non HTML');
    done();
  });

  it('Test to check list and table', (done) => {
    const html = '<ol><li>Coffee</li><><li>Tea</li><li>Milk</li></></ol> Table is next <table><tr><th>Company</th><th>Contact</th><th>Country</th></tr></table>';
    const result = stripHtmlTags(html);

    expect(result).toEqual('CoffeeTeaMilk Table is next CompanyContactCountry');
    done();
  });

  it('Test 3', (done) => {
    const html = '<a href="#fragment">Other text</a> Also tesing if <a href="https://www.google.com/">link</a> is added Favicon is next <link rel="icon" type="image/x-icon" href="/images/favicon.ico">';
    const result = stripHtmlTags(html);

    expect(result).toEqual('Other text Also tesing if link is added Favicon is next');
    done();
  });

  it('Test 4 ASCII UTF-8 and  Windows-1252', (done) => {
    const html = '    <> Something %80 , %A3 ,  <strong>  <strong> %E2%82%AC <strong>';
    const result = stripHtmlTags(html);

    expect(result).toEqual('<strong> %E2%82%AC <strong>');
    done();
  });

  it('Video tags', (done) => {
    const html = '<video width="320" height="240" controls><source src="movie.mp4" type="video/mp4"><source src="movie.ogg" type="video/ogg">Your browser does not support the video tag.</video>';
    const result = stripHtmlTags(html);

    expect(result).toEqual('Your browser does not support the video tag.');
    done();
  });
});
