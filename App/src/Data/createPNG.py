from PIL import Image, ImageDraw

# Create an image with white background
image = Image.new('RGB', (400, 300), color = 'white')
draw = ImageDraw.Draw(image)

# Draw some simple text on the image
draw.text((10, 150), "Sample Chart", fill=(0, 0, 0))

# Save the image
image.save('default_chart.png')
