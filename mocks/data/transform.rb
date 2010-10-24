require 'rubygems'
require 'nokogiri'
require 'json'

doc = Nokogiri::HTML(File.open("companies.html"))

data = []

def parse(content, sep=',')
  content.split(sep).map { |val|
    val = val.strip
    val unless val.empty?
  }.compact
end

doc.xpath("//tr[@class='ListRow1' or @class='ListRow2']").each do |row|
  row_data = {}
  row_data[:name] = row.at_css('td.lst-cl_name a').content
  [
    :majors,
    :work_authorization,
    :degree_level,
    :position_types
  ].each do |field_name|
    row_data[field_name] = parse(row.at_css("td.lst-cl_#{field_name}").content)
  end
  row_data[:day], row_data[:booth] = parse(row.at_css('td.lst-cl_day').content, '/')
  data << row_data
end

puts data.to_json
