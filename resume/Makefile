.PHONY: build pdf

build:
	asciidoctor Guionardo_Furlan_Resume.adoc

pdf: build
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf=Guionardo_Furlan_Resume.pdf Guionardo_Furlan_Resume.html