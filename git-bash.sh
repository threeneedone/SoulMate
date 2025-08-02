# 确保 .gitignore 里有 node_modules/
echo "node_modules/" >> .gitignore

# 添加、提交、推送
git add .
git commit -m "Initial commit without node_modules"
git push -u origin main