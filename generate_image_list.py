
import os
import json

# Get all image files from the images directory
images_dir = 'images'
image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.JPG', '.JPEG', '.PNG', '.GIF')

image_files = []
for filename in os.listdir(images_dir):
    if filename.endswith(image_extensions):
        image_files.append(filename)

# Sort the files
image_files.sort()

# Write to JSON file
with open(os.path.join(images_dir, 'images.json'), 'w') as f:
    json.dump(image_files, f, indent=2)

print(f"Generated images.json with {len(image_files)} images")
print("First 10 images:", image_files[:10])

