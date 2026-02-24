#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
MetaGPT 代码生成 API 封装
用于与 Next.js API 路由通信
"""

import os
import sys
import json
import tempfile
from pathlib import Path
from metagpt.software_company import generate_repo
from metagpt.utils.project_repo import ProjectRepo


def main():
    # 检查输入参数
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "缺少参数：需要传入代码生成请求的 JSON 数据"
        }))
        sys.exit(1)

    try:
        # 解析输入参数
        request_data = json.loads(sys.argv[1])
        prompt = request_data.get("prompt")
        project_name = request_data.get("project_name", "generated_project")
        investment = request_data.get("investment", 3.0)
        n_round = request_data.get("n_round", 5)
        code_review = request_data.get("code_review", True)
        run_tests = request_data.get("run_tests", False)
        implement = request_data.get("implement", True)

        if not prompt:
            print(json.dumps({
                "error": "缺少必填参数：prompt"
            }))
            sys.exit(1)

        # 创建临时目录作为项目工作区
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)

            # 调用 MetaGPT 生成代码
            repo: ProjectRepo = generate_repo(
                idea=prompt,
                investment=investment,
                n_round=n_round,
                code_review=code_review,
                run_tests=run_tests,
                implement=implement,
                project_name=project_name,
                inc=False,
                project_path=str(temp_path),
                reqa_file="",
                max_auto_summarize_code=0,
                recover_path=None,
            )

            # 设置源代码路径
            repo.with_src_path(repo.workdir / repo.workdir.name)

            # 收集项目信息
            project_info = {
                "name": project_name,
                "prompt": prompt,
                "workdir": str(repo.workdir),
                "code_files": []
            }

            # 收集所有代码文件信息
            for file_path in repo.srcs.all_files:
                try:
                    doc = repo.srcs.get(file_path)
                    if doc and doc.content:
                        project_info["code_files"].append({
                            "path": str(doc.filename),
                            "content": doc.content
                        })
                except Exception as e:
                    print(f"Error reading file {file_path}: {str(e)}", file=sys.stderr)

            # 收集文档文件信息
            for file_path in repo.docs.all_files:
                try:
                    doc = repo.docs.get(file_path)
                    if doc and doc.content:
                        project_info["code_files"].append({
                            "path": f"docs/{str(doc.filename)}",
                            "content": doc.content
                        })
                except Exception as e:
                    print(f"Error reading file {file_path}: {str(e)}", file=sys.stderr)

            # 输出项目信息
            print(json.dumps({
                "success": True,
                "data": project_info
            }, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
