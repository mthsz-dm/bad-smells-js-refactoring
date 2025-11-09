export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateHeader(reportType, user) {
    let header = "";
    if (reportType === "CSV") {
      header = "ID,NOME,VALOR,USUARIO\n";
    } else if (reportType === "HTML") {
      header = `<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: ${user.name}</h2>\n<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`;
    }
    return header;
  }

  generateFooter(reportType, total) {
    let footer = "";
    if (reportType === "CSV") {
      footer = `\nTotal,,\n${total},,\n`;
    } else if (reportType === "HTML") {
      footer = `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }
    return footer;
  }

  generateItemLine(reportType, user, item) {
    let line = "";
    if (user.role === "ADMIN" || (user.role === "USER" && item.value <= 500)) {
      if (reportType === "CSV") {
        line = `${item.id},${item.name},${item.value},${user.name}\n`;
      } else if (reportType === "HTML") {
        const style =
          user.role === "ADMIN" && item.value > 1000
            ? 'style="font-weight:bold;"'
            : "";
        line = `<tr ${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
      }
    }
    return line;
  }

  generateReport(reportType, user, items) {
    let report = this.generateHeader(reportType, user);
    let total = 0;

    for (const item of items) {
      report += this.generateItemLine(item, reportType, user);
      total += item.value;
    }

    report += this.generateFooter(reportType, total);
    return report.trim();
  }
}
